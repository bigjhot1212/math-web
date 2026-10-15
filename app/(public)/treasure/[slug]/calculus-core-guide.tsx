import { AlertTriangle, ArrowRight, Check, GitBranch, MoveRight } from 'lucide-react'
import MathExpression, { MathText } from './math-expression'
import styles from './treasure-article.module.css'

function Example({ title, prompt, steps, conclusion }: { title: string; prompt: string; steps: string[]; conclusion: string }) {
  return (
    <article className={styles.coreExample}>
      <div>
        <h4>{title}</h4>
        <p><MathText value={prompt} /></p>
      </div>
      <div className={styles.coreExampleMath}>{steps.map((step) => <MathExpression value={step} key={step} />)}</div>
      <p className={styles.coreConclusion}><Check aria-hidden="true" /><span><MathText value={conclusion} /></span></p>
    </article>
  )
}

export default function CalculusCoreGuide() {
  return (
    <section id="calculus-core" className={styles.calculusCore}>
      <div className={styles.sectionHeading}>
        <span className={styles.mathIcon}>lim</span>
        <div><span>ปูพื้นให้เข้าใจก่อนจำสูตร</span><h2>แผนที่แคลคูลัส: จากลิมิตสู่อนุพันธ์</h2></div>
      </div>

      <p className={styles.coreLead}>
        ลิมิตอธิบายพฤติกรรมของฟังก์ชันเมื่อ <em>x</em> เข้าใกล้ค่าหนึ่ง ส่วนอนุพันธ์ใช้ลิมิตวัดอัตราการเปลี่ยนแปลง ณ จุดนั้น
        เมื่อเห็นความเชื่อมโยงนี้ สูตรต่าง ๆ จะไม่ใช่สิ่งที่ต้องท่องแยกจากกัน
      </p>

      <div className={styles.coreRoute} aria-label="ลำดับการเรียนแคลคูลัส">
        <span>ลิมิต</span><MoveRight aria-hidden="true" /><span>ความต่อเนื่อง</span><MoveRight aria-hidden="true" /><span>อนุพันธ์</span><MoveRight aria-hidden="true" /><span>การประยุกต์</span>
      </div>

      <div className={styles.coreUnit}>
        <div className={styles.coreUnitHeading}>
          <div><span>ลิมิต</span><h3>เริ่มจากแทนค่า แล้วอ่านผลให้ถูก</h3></div>
          <p>โจทย์ลิมิตส่วนใหญ่เริ่มได้ด้วยการแทน <em>x = a</em> แต่ผลที่ได้เป็นเพียงตัวบอกว่าเราควรทำอะไรต่อ</p>
        </div>

        <div className={styles.limitDecision}>
          <div className={styles.decisionStart}>
            <MathExpression value="lim_{x→a} f(x)" />
            <ArrowRight aria-hidden="true" />
            <strong>ลองแทน <em>x = a</em></strong>
          </div>
          <div className={styles.decisionOutcomes}>
            <div><strong>ได้ค่าจำนวนจริง</strong><p>ถ้าฟังก์ชันต่อเนื่องที่จุดนั้น ค่าที่แทนได้คือลิมิต</p></div>
            <div><strong>ได้ 0 / จำนวนที่ไม่เป็น 0</strong><p>ลิมิตของเศษส่วนเท่ากับ 0</p></div>
            <div><strong>ได้ 0 / 0</strong><p>เป็นรูปกำกวม ต้องจัดรูปก่อน แล้วจึงแทนค่าใหม่</p></div>
            <div><strong>ได้จำนวนที่ไม่เป็น 0 / 0</strong><p>ตรวจเครื่องหมายและลิมิตซ้าย–ขวา อาจได้ ±∞ หรือไม่มีลิมิต</p></div>
          </div>
        </div>

        <div className={styles.techniqueRows}>
          <div>
            <h4>แยกตัวประกอบ</h4>
            <p>ใช้เมื่อเศษหรือส่วนเป็นพหุนาม แล้วตัดตัวประกอบร่วมได้ในบริเวณใกล้จุดที่หา แม้ฟังก์ชันเดิมจะนิยามไม่ได้ตรงจุดนั้น</p>
            <MathExpression value="u^2 − a^2 = (u − a)(u + a); u^3 − a^3 = (u − a)(u^2 + ua + a^2); u^3 + a^3 = (u + a)(u^2 − ua + a^2)" />
          </div>
          <div>
            <h4>คูณด้วยสังยุค</h4>
            <p>ใช้กับนิพจน์ที่มีราก เพื่อสร้างผลต่างกำลังสองและกำจัดรูปกำกวม 0 / 0</p>
            <MathExpression value="(√u − √v)(√u + √v) = u − v" />
          </div>
        </div>

        <div className={styles.coreExamples}>
          <Example
            title="ตัวอย่าง: แยกตัวประกอบ"
            prompt="จงหาลิมิตเมื่อ x เข้าใกล้ 2"
            steps={['lim_{x→2} (x^2 − 4)/(x − 2)', 'lim_{x→2} [(x − 2)(x + 2)]/(x − 2) = lim_{x→2} (x + 2)', '= 4']}
            conclusion="ตัด x − 2 ได้เพราะการหาลิมิตพิจารณาค่า x ที่เข้าใกล้ 2 แต่ x ≠ 2"
          />
          <Example
            title="ตัวอย่าง: คูณด้วยสังยุค"
            prompt="จงหาลิมิตเมื่อ x เข้าใกล้ 4"
            steps={['lim_{x→4} (√x − 2)/(x − 4)', 'lim_{x→4} 1/(√x + 2)', '= 1/4']}
            conclusion="คูณทั้งเศษและส่วนด้วย √x + 2 แล้วใช้ (√x − 2)(√x + 2) = x − 4"
          />
        </div>

        <div className={styles.sidedLimits}>
          <div>
            <h4>ลิมิตซ้ายและลิมิตขวา</h4>
            <p>ลิมิตสองข้างที่ <em>x = a</em> มีอยู่และเท่ากับ <em>L</em> ก็ต่อเมื่อลิมิตจากซ้ายและขวามีอยู่และเท่ากับจำนวนจริงเดียวกัน</p>
            <MathExpression value="lim_{x→a−} f(x) = lim_{x→a+} f(x) = L" />
          </div>
          <div className={styles.graphCases}>
            <p><strong>มีรูโหว่</strong><span>ลิมิตอาจมีอยู่ แม้ f(a) ไม่มีค่าหรือไม่เท่ากับลิมิต</span></p>
            <p><strong>กราฟกระโดด</strong><span>ถ้าซ้ายกับขวาเข้าใกล้คนละค่า ลิมิตสองข้างไม่มีอยู่</span></p>
            <p><strong>พุ่งสู่อนันต์</strong><span>ตรวจทิศทางของแต่ละข้าง ไม่สรุปจากการเห็นส่วนเป็นศูนย์เพียงอย่างเดียว</span></p>
          </div>
        </div>

        <div className={styles.continuityCheck}>
          <div><GitBranch aria-hidden="true" /><h4>ฟังก์ชันต่อเนื่องที่ x = a เมื่อครบทั้ง 3 ข้อ</h4></div>
          <ol>
            <li><span>1</span><p><strong>f(a) นิยาม</strong> ต้องหาค่าฟังก์ชันที่จุดนั้นได้</p></li>
            <li><span>2</span><p><strong>ลิมิตสองข้างมีอยู่</strong> ลิมิตซ้ายและขวาต้องเท่ากันและเป็นจำนวนจริง</p></li>
            <li><span>3</span><p><strong>lim f(x) = f(a)</strong> ค่าที่กราฟเข้าใกล้ต้องตรงกับค่าฟังก์ชัน</p></li>
          </ol>
          <p>บนช่วงปิด [a, b] ให้ตรวจความต่อเนื่องใน (a, b) พร้อมลิมิตขวาที่ a และลิมิตซ้ายที่ b</p>
        </div>
      </div>

      <div className={styles.coreUnit}>
        <div className={styles.coreUnitHeading}>
          <div><span>อนุพันธ์</span><h3>มองเป็นความชันและอัตราการเปลี่ยนแปลง</h3></div>
          <p>อนุพันธ์ <em>f′(a)</em> คือความชันของเส้นสัมผัสกราฟที่ <em>x = a</em> และบอกว่าค่าฟังก์ชันกำลังเปลี่ยนเร็วเพียงใด ณ จุดนั้น</p>
        </div>

        <div className={styles.derivativeMeaning}>
          <MathExpression value="f′(a) = lim_{h→0} [f(a + h) − f(a)]/h" />
          <div>
            <p><strong>f′(a) &gt; 0</strong><span>กราฟมีความชันบวก ณ จุดนั้น</span></p>
            <p><strong>f′(a) = 0</strong><span>เส้นสัมผัสแนวนอน แต่ยังสรุปไม่ได้ว่าเป็นจุดสูงสุดหรือต่ำสุด</span></p>
            <p><strong>f′(a) &lt; 0</strong><span>กราฟมีความชันลบ ณ จุดนั้น</span></p>
          </div>
        </div>

        <div className={styles.ruleTable}>
          <div><strong>ค่าคงที่</strong><MathExpression value="d(c)/dx = 0" /></div>
          <div><strong>กฎเลขยกกำลัง</strong><MathExpression value="d(x^n)/dx = nx^{n−1}" /></div>
          <div><strong>ผลบวก–ผลต่าง</strong><MathExpression value="[f(x) ± g(x)]′ = f′(x) ± g′(x)" /></div>
          <div><strong>กฎลูกโซ่</strong><MathExpression value="[f(g(x))]′ = f′(g(x))g′(x)" /></div>
          <div><strong>กฎผลคูณ</strong><MathExpression value="[f(x)g(x)]′ = f′(x)g(x) + f(x)g′(x)" /></div>
          <div><strong>กฎผลหาร</strong><MathExpression value="[f(x)/g(x)]′ = [f′(x)g(x) − f(x)g′(x)]/[g(x)]^2" /><small>ใช้เมื่อ g(x) ≠ 0</small></div>
        </div>

        <div className={styles.coreExamples}>
          <Example
            title="ตัวอย่าง: กฎลูกโซ่"
            prompt="หาอนุพันธ์ของ y = (3x² + 1)⁴"
            steps={["y′ = 4(3x^2 + 1)^3(6x)", "= 24x(3x^2 + 1)^3"]}
            conclusion="ดิฟฟังก์ชันชั้นนอกก่อน แล้วคูณด้วยอนุพันธ์ของฟังก์ชันชั้นใน"
          />
          <Example
            title="ตัวอย่าง: กฎผลหาร"
            prompt="หาอนุพันธ์ของ y = (x + 1)/(x − 1)"
            steps={["y′ = [(1)(x − 1) − (x + 1)(1)]/(x − 1)^2", "= −2/(x − 1)^2"]}
            conclusion="คำตอบใช้ได้เมื่อ x ≠ 1 ซึ่งเป็นโดเมนเดิมของฟังก์ชัน"
          />
        </div>

        <div className={styles.lineEquations}>
          <div><h4>เส้นสัมผัสที่ x = a</h4><MathExpression value="m_t = f′(a); y − f(a) = f′(a)(x − a)" /></div>
          <div><h4>เส้นตั้งฉากที่ x = a</h4><MathExpression value="m_n = −1/f′(a); y − f(a) = m_n(x − a)" /><p>สูตรความชันนี้ใช้เมื่อ f′(a) ≠ 0; ถ้า f′(a) = 0 เส้นตั้งฉากคือเส้นแนวตั้ง x = a</p></div>
        </div>

        <div className={styles.applicationFlow}>
          <h4>ใช้อนุพันธ์วิเคราะห์กราฟและโจทย์ค่าสูงสุด–ต่ำสุด</h4>
          <ol>
            <li><span>1</span><p><strong>กำหนดโดเมน</strong> ระบุช่วงและข้อจำกัดของตัวแปร</p></li>
            <li><span>2</span><p><strong>หาอนุพันธ์และจำนวนวิกฤต</strong> ตรวจจุดที่ f′(x) = 0 หรือ f′(x) ไม่มีอยู่ โดยจุดนั้นต้องอยู่ในโดเมนของ f</p></li>
            <li><span>3</span><p><strong>ตรวจการเปลี่ยนเครื่องหมาย</strong> + → − เป็นจุดสูงสุดสัมพัทธ์ และ − → + เป็นจุดต่ำสุดสัมพัทธ์</p></li>
            <li><span>4</span><p><strong>โจทย์บนช่วงปิดต้องตรวจปลายช่วง</strong> เปรียบเทียบค่าฟังก์ชันที่จำนวนวิกฤตและปลายช่วงทุกจุด</p></li>
            <li><span>5</span><p><strong>ตอบให้ตรงสิ่งที่ถาม</strong> แยก “ตำแหน่งที่เกิด” ออกจาก “ค่าสูงสุดหรือต่ำสุด” และใส่หน่วย</p></li>
          </ol>
        </div>

        <p className={styles.coreWarning}><AlertTriangle aria-hidden="true" /><span><strong>อย่าสรุปจาก f′(c) = 0 เพียงอย่างเดียว</strong> จุดดังกล่าวเป็นเพียงจุดที่ต้องตรวจต่อ อาจไม่ใช่ทั้งจุดสูงสุดและจุดต่ำสุดก็ได้</span></p>
      </div>
    </section>
  )
}
