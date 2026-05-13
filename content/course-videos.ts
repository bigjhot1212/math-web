export type CourseStatus = 'available' | 'coming_soon'

export interface CourseConfig {
  name: string
  nameEn: string
  desc: string
  status: CourseStatus
  classroomId?: string
  videoId?: string   // YouTube video ID (optional)
}

export const COURSES: Record<string, CourseConfig> = {
  'set':                      { name: 'เซต',                             nameEn: 'Set Theory',              desc: 'สหภาพ ทางตัด ส่วนเติมเต็ม และการดำเนินการบนเซต',              status: 'coming_soon' },
  'logic':                    { name: 'ตรรกศาสตร์',                      nameEn: 'Logic',                   desc: 'ประพจน์ ตัวเชื่อม ตารางค่าความจริง และการอ้างเหตุผล',          status: 'coming_soon' },
  'real-numbers':             { name: 'จำนวนจริง',                       nameEn: 'Real Numbers',            desc: 'สมบัติของจำนวนจริง ค่าสัมบูรณ์ และอสมการ',                    status: 'coming_soon' },
  'relations-functions':      { name: 'ความสัมพันธ์และฟังก์ชัน',         nameEn: 'Relations & Functions',   desc: 'โดเมน เรนจ์ ฟังก์ชันผกผัน และฟังก์ชันประกอบ',                 status: 'coming_soon' },
  'exponential-logarithm':    { name: 'เอกซ์โพเนนเชียลและลอการิทึม',    nameEn: 'Exponential & Logarithm', desc: 'กราฟ สมการ และอสมการเอกซ์โพเนนเชียลและลอการิทึม',             status: 'coming_soon' },
  'analytic-geometry-conics': { name: 'เรขาคณิตวิเคราะห์และภาคตัดกรวย', nameEn: 'Analytic Geometry',       desc: 'วงกลม วงรี พาราโบลา และไฮเพอร์โบลา',                          status: 'coming_soon' },
  'trigonometry':             { name: 'ตรีโกณมิติ',                      nameEn: 'Trigonometry',            desc: 'ฟังก์ชันตรีโกณมิติ เอกลักษณ์ สูตรผลบวกและผลต่าง',             status: 'coming_soon' },
  'matrix':                   { name: 'เมทริกซ์',                        nameEn: 'Matrix',                  desc: 'การดำเนินการเมทริกซ์ ดีเทอร์มิแนนต์ และเมทริกซ์ผกผัน',        status: 'coming_soon' },
  'vector':                   { name: 'เวกเตอร์',                        nameEn: 'Vector',                  desc: 'ผลคูณดอต ผลคูณไขว้ และการประยุกต์ใช้เวกเตอร์',               status: 'coming_soon' },
  'complex-numbers':          { name: 'จำนวนเชิงซ้อน',                   nameEn: 'Complex Numbers',         desc: 'รูปแบบ a+bi การดำเนินการ และรูปแบบเชิงขั้ว',                  status: 'coming_soon' },
  'counting-probability':     { name: 'หลักการนับและความน่าจะเป็น',       nameEn: 'Counting & Probability',  desc: 'การเรียงสับเปลี่ยน การจัดหมู่ และความน่าจะเป็นเบื้องต้น',     status: 'coming_soon' },
  'sequences-series':         { name: 'ลำดับและอนุกรม',                   nameEn: 'Sequences & Series',      desc: 'ลำดับเลขคณิต เลขาคณิต อนุกรม และการประยุกต์',                 status: 'available',   classroomId: 'ODY0MjE2NjIwMTQ1' },
  'calculus':                 { name: 'แคลคูลัสเบื้องต้น',               nameEn: 'Calculus',                desc: 'ลิมิต อนุพันธ์ และปริพันธ์เบื้องต้น',                         status: 'available',   classroomId: 'ODQ4NjEwNjA0NDU0' },
  'statistics-distributions': { name: 'สถิติและตัวแปรสุ่ม',              nameEn: 'Statistics',              desc: 'การแจกแจงความน่าจะเป็น ค่าเฉลี่ย และส่วนเบี่ยงเบนมาตรฐาน',  status: 'coming_soon' },
}
