import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Question } from '@/lib/types/question'
import { legacySetPracticeQuestions, originalPracticeQuestions } from '@/lib/content/original-practice'
import { setChallengeQuestions } from '@/lib/content/set-challenge'
import { allMath1MockQuestions, getMath1MockSet } from '@/lib/content/math1-mock-sets'
import {
  calculateExamPoints,
  countCorrectExamAnswers,
  isCorrectExamAnswer,
  sanitizeExamAnswers,
} from '@/lib/exam-scoring'
import { isHunterRankingReleased, isMonthlyRankExamType } from '@/lib/hunter-ranking'
import { finalizeMonthlyRankExam, selectHunterRankQuestions } from '@/lib/hunter-rank-finalization'
import type { HunterRankFinalizationReason } from '@/lib/hunter-rank-persistence'
import { isAdminEmail } from '@/lib/payment-config'
import fs from 'fs'
import path from 'path'

const FINALIZATION_REASONS = new Set<HunterRankFinalizationReason>([
  'submitted',
  'left_exam',
  'time_expired',
])

function loadAllQuestions(): Question[] {
  const dir = path.join(process.cwd(), 'content', 'questions')
  return fs.readdirSync(dir)
    .filter(file => file.endsWith('.json'))
    .flatMap(file => JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8')) as Question[])
    .concat(originalPracticeQuestions, legacySetPracticeQuestions, setChallengeQuestions, allMath1MockQuestions)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null) as {
      examId?: unknown
      answers?: unknown
      finalizationReason?: unknown
    } | null
    if (!body || typeof body.examId !== 'string') {
      return NextResponse.json({ error: 'ข้อมูลการส่งข้อสอบไม่ถูกต้อง' }, { status: 400 })
    }
    const answers = sanitizeExamAnswers(body.answers)
    if (!answers) {
      return NextResponse.json({ error: 'ข้อมูลคำตอบไม่ถูกต้อง' }, { status: 400 })
    }
    const requestedReason = body.finalizationReason
    const finalizationReason: HunterRankFinalizationReason = typeof requestedReason === 'string'
      && FINALIZATION_REASONS.has(requestedReason as HunterRankFinalizationReason)
      ? requestedReason as HunterRankFinalizationReason
      : 'submitted'

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อน' }, { status: 401 })

    const { data: session, error: fetchError } = await supabase
      .from('exam_sessions')
      .select('*')
      .eq('id', body.examId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !session) {
      return NextResponse.json({ error: 'ไม่พบรอบสอบนี้' }, { status: 404 })
    }
    if (isMonthlyRankExamType(session.exam_type) && !isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'ข้อสอบจัดอันดับยังไม่เปิดให้ใช้งาน' }, { status: 403 })
    }
    if (isMonthlyRankExamType(session.exam_type) && !isHunterRankingReleased()) {
      return NextResponse.json({ error: 'ข้อสอบจัดอันดับจะเปิดวันที่ 7 พฤศจิกายน 2569' }, { status: 403 })
    }
    if (session.submitted_at) {
      return NextResponse.json({ error: 'ข้อสอบนี้ถูกส่งไปแล้ว' }, { status: 409 })
    }

    const monthlyQuestions = getMath1MockSet(session.exam_type)?.questions ?? []
    const allQuestions = loadAllQuestions().concat(monthlyQuestions)
    const questionIds = Array.isArray(session.question_ids) ? session.question_ids as string[] : []
    if (questionIds.length === 0) {
      return NextResponse.json({ error: 'ชุดข้อสอบไม่สมบูรณ์ กรุณาติดต่อผู้สอน' }, { status: 500 })
    }
    const questions = selectHunterRankQuestions(allQuestions, questionIds)

    const scoring = calculateExamPoints(questions, answers)
    const score = countCorrectExamAnswers(questions, answers)
    const isMonthlyRankExam = isMonthlyRankExamType(session.exam_type)

    if (isMonthlyRankExam) {
      const result = await finalizeMonthlyRankExam({
        supabase,
        userId: user.id,
        sessionId: session.id,
        examType: session.exam_type,
        questions,
        answers,
        finalizationReason,
      })
      if (!result.finalized) {
        return NextResponse.json({ error: 'ข้อสอบนี้ถูกส่งไปแล้ว' }, { status: 409 })
      }
    } else {
      const { data: updatedSession, error: updateError } = await supabase
        .from('exam_sessions')
        .update({
          answers,
          submitted_at: new Date().toISOString(),
          score,
          total_questions: session.total_questions,
        })
        .eq('id', session.id)
        .eq('user_id', user.id)
        .is('submitted_at', null)
        .select('id')
        .maybeSingle()
      if (updateError) throw updateError
      if (!updatedSession) {
        return NextResponse.json({ error: 'ข้อสอบนี้ถูกส่งไปแล้ว' }, { status: 409 })
      }
    }

    const breakdown: Record<string, { correct: number; total: number }> = {}
    for (const question of questions) {
      if (!breakdown[question.topicId]) breakdown[question.topicId] = { correct: 0, total: 0 }
      breakdown[question.topicId].total += 1
      if (isCorrectExamAnswer(question, answers[question.id])) breakdown[question.topicId].correct += 1
    }

    const displayedPoints = isMonthlyRankExam ? scoring.points : scoring.earnedPoints
    return NextResponse.json({
      score,
      total: questions.length,
      points: displayedPoints,
      earnedPoints: scoring.earnedPoints,
      penaltyPoints: scoring.penaltyPoints,
      maximumPoints: scoring.maximumPoints,
      percentage: scoring.maximumPoints > 0 ? Math.round((displayedPoints / scoring.maximumPoints) * 100) : 0,
      breakdown,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'ส่งข้อสอบไม่สำเร็จ กรุณาลองใหม่' }, { status: 500 })
  }
}
