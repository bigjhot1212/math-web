export type CourseStatus = 'available' | 'coming_soon'
export type CourseZone = 'special' | 'm4' | 'm5' | 'm6'

export interface CurriculumSection {
  title?: string
  items: string[]
}

export interface CourseConfig {
  name: string
  nameEn: string
  desc: string
  status: CourseStatus
  zone: CourseZone
  classroomId?: string
  videoId?: string   // YouTube video ID (optional)
  price?: number      // fixed price in THB; omit to use the standard 390/340 topic pricing
  curriculum?: CurriculumSection[]
}

export const ZONE_LABELS: Record<CourseZone, string> = {
  special: 'คอร์สพิเศษ',
  m4: 'ม.4',
  m5: 'ม.5',
  m6: 'ม.6',
}

export interface BundleConfig {
  name: string
  topicIds: string[]
  price: number       // fixed bundle price in THB
  regularTotal: number // sum of individual prices, for showing the strikethrough
  zone: CourseZone
}

export const BUNDLES: Record<string, BundleConfig> = {
  'm6-bundle': {
    name: 'ครบชุด ม.6 (3 บท)',
    topicIds: ['sequences-series', 'calculus', 'statistics-distributions'],
    price: 1090,
    regularTotal: 1170,
    zone: 'm6',
  },
}

export const COURSES: Record<string, CourseConfig> = {
  'foundation-high-school': {
    name: 'ปรับพื้นฐานสำหรับเรียนม.ปลาย',
    nameEn: 'High School Foundation',
    desc: 'ทบทวนพื้นฐานคณิตศาสตร์ ม.ต้น เตรียมพร้อมก่อนเรียนคณิตศาสตร์ ม.ปลาย',
    status: 'available',
    zone: 'special',
    classroomId: 'ODU0ODA2OTA5ODQx',
    price: 490,
    curriculum: [
      {
        title: 'PART 0 — ฐานราก',
        items: ['จำนวนและการดำเนินการ', 'เศษส่วนเร่งรัด'],
      },
      {
        title: 'PART 1 — ระบบการดำเนินการ',
        items: [
          'กฎเลขยกกำลัง 7 ข้อ',
          'เลขชี้กำลังเป็นศูนย์และลบ',
          'เลขชี้กำลังเป็นเศษส่วนและรากที่ n',
          'การทำรากให้อยู่ในรูปอย่างง่าย',
          'ค่าสัมบูรณ์',
        ],
      },
      {
        title: 'PART 2 — พีชคณิต',
        items: [
          'นิพจน์พีชคณิต — บวกลบและจัดหมู่',
          'การคูณนิพจน์และกฎการกระจาย',
          'รูปแบบพิเศษ',
          'การแยกตัวประกอบ',
          'การแก้สมการเชิงเส้น',
          'การแก้สมการกำลังสอง 3 วิธี',
          'ระบบสมการสองตัวแปร',
          'เศษส่วนพีชคณิต',
          'อสมการและ Sign Chart',
          'ทฤษฎีตัวประกอบและทฤษฎีเศษเหลือ',
        ],
      },
    ],
  },

  'set':                      { name: 'เซต',                             nameEn: 'Set Theory',              desc: 'สหภาพ ทางตัด ส่วนเติมเต็ม และการดำเนินการบนเซต',              status: 'coming_soon', zone: 'm4' },
  'logic':                    { name: 'ตรรกศาสตร์',                      nameEn: 'Logic',                   desc: 'ประพจน์ ตัวเชื่อม ตารางค่าความจริง และการอ้างเหตุผล',          status: 'coming_soon', zone: 'm4' },
  'real-numbers':             { name: 'จำนวนจริง',                       nameEn: 'Real Numbers',            desc: 'สมบัติของจำนวนจริง ค่าสัมบูรณ์ และอสมการ',                    status: 'coming_soon', zone: 'm4' },
  'relations-functions':      { name: 'ความสัมพันธ์และฟังก์ชัน',         nameEn: 'Relations & Functions',   desc: 'โดเมน เรนจ์ ฟังก์ชันผกผัน และฟังก์ชันประกอบ',                 status: 'coming_soon', zone: 'm4' },
  'exponential-logarithm':    { name: 'เอกซ์โพเนนเชียลและลอการิทึม',    nameEn: 'Exponential & Logarithm', desc: 'กราฟ สมการ และอสมการเอกซ์โพเนนเชียลและลอการิทึม',             status: 'coming_soon', zone: 'm4' },
  'analytic-geometry-conics': { name: 'เรขาคณิตวิเคราะห์และภาคตัดกรวย', nameEn: 'Analytic Geometry',       desc: 'วงกลม วงรี พาราโบลา และไฮเพอร์โบลา',                          status: 'coming_soon', zone: 'm4' },

  'trigonometry':             { name: 'ตรีโกณมิติ',                      nameEn: 'Trigonometry',            desc: 'ฟังก์ชันตรีโกณมิติ เอกลักษณ์ สูตรผลบวกและผลต่าง',             status: 'coming_soon', zone: 'm5' },
  'matrix':                   { name: 'เมทริกซ์',                        nameEn: 'Matrix',                  desc: 'การดำเนินการเมทริกซ์ ดีเทอร์มิแนนต์ และเมทริกซ์ผกผัน',        status: 'coming_soon', zone: 'm5' },
  'vector':                   { name: 'เวกเตอร์',                        nameEn: 'Vector',                  desc: 'ผลคูณดอต ผลคูณไขว้ และการประยุกต์ใช้เวกเตอร์',               status: 'coming_soon', zone: 'm5' },
  'complex-numbers':          { name: 'จำนวนเชิงซ้อน',                   nameEn: 'Complex Numbers',         desc: 'รูปแบบ a+bi การดำเนินการ และรูปแบบเชิงขั้ว',                  status: 'coming_soon', zone: 'm5' },
  'counting-probability':     { name: 'หลักการนับและความน่าจะเป็น',       nameEn: 'Counting & Probability',  desc: 'การเรียงสับเปลี่ยน การจัดหมู่ และความน่าจะเป็นเบื้องต้น',     status: 'coming_soon', zone: 'm5' },

  'sequences-series': {
    name: 'ลำดับและอนุกรม',
    nameEn: 'Sequences & Series',
    desc: 'ลำดับเลขคณิต เลขาคณิต อนุกรม และการประยุกต์',
    status: 'available',
    zone: 'm6',
    classroomId: 'ODY0MjE2NjIwMTQ1',
    curriculum: [
      {
        items: [
          'ลำดับทั่วไป',
          'ลำดับเลขคณิต',
          'ลำดับเรขาคณิต',
          'ลำดับเวียนเกิด',
          'ลิมิตของลำดับ',
          'อนุกรมและสัญลักษณ์ซิกม่า (Σ)',
          'อนุกรมเลขคณิต',
          'อนุกรมเรขาคณิต',
          'อนุกรมอนันต์',
          'อนุกรมเทเลสโคปิก',
          'อนุกรมเรขาคณิตดัดแปลง',
          'ดอกเบี้ยทบต้นและการออมเงิน',
          'เงินผ่อนและค่างวด',
        ],
      },
    ],
  },

  'calculus': {
    name: 'แคลคูลัสเบื้องต้น',
    nameEn: 'Calculus',
    desc: 'ลิมิต อนุพันธ์ และปริพันธ์เบื้องต้น',
    status: 'available',
    zone: 'm6',
    classroomId: 'ODQ4NjEwNjA0NDU0',
    curriculum: [
      {
        items: [
          'ลิมิตของฟังก์ชัน',
          'ลิมิตซ้าย–ขวา',
          'ความต่อเนื่อง',
          'อนุพันธ์',
          'Chain Rule (กฎลูกโซ่)',
          'ความชันและเส้นสัมผัส',
          'ฟังก์ชันเพิ่ม-ลด และค่าสูงสุด-ต่ำสุดสัมพัทธ์',
          'ปฏิยานุพันธ์และการอินทิเกรต',
          'อินทิเกรตจำกัดเขต',
          'พื้นที่ที่ปิดล้อมด้วยเส้นโค้ง',
          'อัตราการเปลี่ยนแปลงเฉลี่ยและขณะใดขณะหนึ่ง',
        ],
      },
    ],
  },

  'statistics-distributions': {
    name: 'สถิติและตัวแปรสุ่ม',
    nameEn: 'Statistics',
    desc: 'การแจกแจงความน่าจะเป็น ค่าเฉลี่ย และส่วนเบี่ยงเบนมาตรฐาน',
    status: 'available',
    zone: 'm6',
    classroomId: 'ODY4ODkzMzcxMzAw',
    curriculum: [
      {
        items: [
          'ข้อมูลเบื้องต้น',
          'ค่ากลางของข้อมูล',
          'การวัดตำแหน่งข้อมูล',
          'การวัดการกระจายสัมบูรณ์',
          'การวัดการกระจายสัมพัทธ์',
          'คะแนนมาตรฐาน',
          'การแจกแจงปกติ',
          'แผนภาพกล่อง (Boxplot)',
          'ตัวแปรสุ่มและค่าคาดหมาย',
          'การแจกแจงทวินาม',
        ],
      },
    ],
  },
}
