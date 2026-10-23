import { Check, CircleDot, Compass, RotateCcw, Triangle } from 'lucide-react'
import MathExpression, { MathText } from './math-expression'
import styles from './treasure-article.module.css'

const ANGLES = [
  { degree: '0°', radian: '0', x: 588, y: 310, anchor: 'start' as const },
  { degree: '30°', radian: 'π/6', x: 552, y: 174, anchor: 'start' as const },
  { degree: '45°', radian: 'π/4', x: 493, y: 111, anchor: 'start' as const },
  { degree: '60°', radian: 'π/3', x: 402, y: 61, anchor: 'middle' as const },
  { degree: '90°', radian: 'π/2', x: 310, y: 28, anchor: 'middle' as const },
  { degree: '120°', radian: '2π/3', x: 218, y: 61, anchor: 'middle' as const },
  { degree: '135°', radian: '3π/4', x: 127, y: 111, anchor: 'end' as const },
  { degree: '150°', radian: '5π/6', x: 68, y: 174, anchor: 'end' as const },
  { degree: '180°', radian: 'π', x: 32, y: 310, anchor: 'end' as const },
  { degree: '210°', radian: '7π/6', x: 68, y: 456, anchor: 'end' as const },
  { degree: '225°', radian: '5π/4', x: 127, y: 519, anchor: 'end' as const },
  { degree: '240°', radian: '4π/3', x: 218, y: 569, anchor: 'middle' as const },
  { degree: '270°', radian: '3π/2', x: 310, y: 602, anchor: 'middle' as const },
  { degree: '300°', radian: '5π/3', x: 402, y: 569, anchor: 'middle' as const },
  { degree: '315°', radian: '7π/4', x: 493, y: 519, anchor: 'start' as const },
  { degree: '330°', radian: '11π/6', x: 552, y: 456, anchor: 'start' as const },
]

const POINTS = [
  [540, 310], [509, 195], [473, 147], [425, 111], [310, 80], [195, 111], [147, 147], [111, 195],
  [80, 310], [111, 425], [147, 473], [195, 509], [310, 540], [425, 509], [473, 473], [509, 425],
]

function UnitCircleFigure() {
  return (
    <figure className={styles.unitCircleFigure}>
      <svg viewBox="0 0 620 630" role="img" aria-labelledby="unit-circle-title unit-circle-desc">
        <title id="unit-circle-title">วงกลมหนึ่งหน่วยและมุมมาตรฐาน</title>
        <desc id="unit-circle-desc">วงกลมรัศมีหนึ่ง แสดงมุมมาตรฐานทั้งองศาและเรเดียน โดยเริ่มจากแกนเอ็กซ์บวกและหมุนทวนเข็มนาฬิกา</desc>
        <line className={styles.unitAxis} x1="52" y1="310" x2="568" y2="310" />
        <line className={styles.unitAxis} x1="310" y1="52" x2="310" y2="568" />
        <circle className={styles.unitRing} cx="310" cy="310" r="230" />
        <path className={styles.unitRadius} d="M310 310 L425 111" />
        <path className={styles.unitArc} d="M390 310 A80 80 0 0 0 350 241" />
        <line className={styles.unitProjection} x1="425" y1="111" x2="425" y2="310" />
        <line className={styles.unitProjection} x1="425" y1="111" x2="310" y2="111" />
        {POINTS.map(([x, y], index) => <circle className={styles.unitPoint} cx={x} cy={y} r="5" key={`${x}-${y}-${index}`} />)}
        {ANGLES.map((angle) => (
          <text className={styles.unitAngle} x={angle.x} y={angle.y} textAnchor={angle.anchor} key={angle.degree}>
            <tspan x={angle.x}>{angle.degree}</tspan>
            <tspan className={styles.unitRadian} x={angle.x} dy="17">{angle.radian}</tspan>
          </text>
        ))}
        <text className={styles.unitTheta} x="365" y="274">θ</text>
        <text className={styles.unitCoordinate} x="431" y="99">P(cos θ, sin θ)</text>
        <text className={styles.unitCoordinate} x="355" y="334">cos θ</text>
        <text className={styles.unitCoordinate} x="431" y="218">sin θ</text>
        <text className={styles.unitAxisLabel} x="574" y="302">x</text>
        <text className={styles.unitAxisLabel} x="320" y="48">y</text>
        <text className={styles.unitOrigin} x="296" y="330">O</text>
      </svg>
      <figcaption>
        <strong>อ่านวงกลมจากแกน <MathText value="x บวก" /></strong>
        <span>ทวนเข็มนาฬิกาเป็นมุมบวก ตามเข็มนาฬิกาเป็นมุมลบ และหมุนครบหนึ่งรอบเท่ากับ <MathText value="360°=2π rad" /></span>
      </figcaption>
    </figure>
  )
}

function CoordinateProjectionFigure() {
  return (
    <figure className={styles.coordinateProofFigure}>
      <svg viewBox="0 0 470 390" role="img" aria-labelledby="coordinate-proof-title coordinate-proof-desc">
        <title id="coordinate-proof-title">ที่มาของโคไซน์และไซน์บนวงกลมหนึ่งหน่วย</title>
        <desc id="coordinate-proof-desc">จุดพีบนวงกลมหนึ่งหน่วยถูกฉายลงแกนเอ็กซ์ เกิดสามเหลี่ยมมุมฉากที่มีด้านประชิดยาวเอ็กซ์ ด้านตรงข้ามยาววาย และด้านตรงข้ามมุมฉากยาวหนึ่ง</desc>
        <line className={styles.unitAxis} x1="52" y1="210" x2="420" y2="210" />
        <line className={styles.unitAxis} x1="190" y1="354" x2="190" y2="42" />
        <circle className={styles.unitRing} cx="190" cy="210" r="140" />
        <path className={styles.unitRadius} d="M190 210 L297 120" />
        <line className={styles.unitProjectionStrong} x1="297" y1="120" x2="297" y2="210" />
        <line className={styles.unitProjection} x1="297" y1="120" x2="190" y2="120" />
        <path className={styles.unitRightAngle} d="M285 210 L285 198 L297 198" />
        <path className={styles.unitArc} d="M241 210 A51 51 0 0 0 229 177" />
        <circle className={styles.unitFocusPoint} cx="297" cy="120" r="7" />
        <circle className={styles.unitPoint} cx="297" cy="210" r="5" />
        <text className={styles.unitTheta} x="238" y="192">θ</text>
        <text className={styles.unitCoordinate} x="306" y="112">P(x, y)</text>
        <text className={styles.unitSideLabel} x="239" y="233">ด้านประชิด = x</text>
        <text className={styles.unitSideLabel} x="306" y="169">ด้านตรงข้าม = y</text>
        <text className={styles.unitRadiusLabel} x="233" y="153">รัศมี = 1</text>
        <text className={styles.unitAxisLabel} x="425" y="203">x</text>
        <text className={styles.unitAxisLabel} x="200" y="40">y</text>
        <text className={styles.unitOrigin} x="176" y="229">O</text>
      </svg>
      <figcaption>
        <h3>ลากเส้นฉากลงแกน แล้วนิยามจะปรากฏเอง</h3>
        <p>จุด <MathText value="P" /> อยู่บนวงกลมรัศมี 1 จึงเกิดสามเหลี่ยมมุมฉากที่มีด้านตรงข้ามมุมฉากยาว 1</p>
        <div className={styles.coordinateDerivation}>
          <div><p className={styles.coordinateEquation}><MathText value="cosθ=x/1=x" /></p><span>เพราะ <strong>ด้านประชิด</strong> ยาวเท่ากับพิกัดแนวนอน <MathText value="x" /> จึงได้ <MathText value="x=cosθ" /></span></div>
          <div><p className={styles.coordinateEquation}><MathText value="sinθ=y/1=y" /></p><span>เพราะ <strong>ด้านตรงข้าม</strong> ยาวเท่ากับพิกัดแนวตั้ง <MathText value="y" /> จึงได้ <MathText value="y=sinθ" /></span></div>
        </div>
        <p className={styles.coordinateProofNote}>เมื่อจุดย้ายไปควอดแรนต์อื่น ความยาวของด้านยังเป็นบวก แต่พิกัด <MathText value="x,y" /> อาจติดลบตามทิศของแกน นี่คือที่มาของเครื่องหมายของ sin และ cos</p>
      </figcaption>
    </figure>
  )
}

function ReferenceAngleFigure() {
  return (
    <figure className={styles.referenceAngleFigure}>
      <svg viewBox="0 0 430 390" role="img" aria-labelledby="reference-angle-title reference-angle-desc">
        <title id="reference-angle-title">การหามุมอ้างอิงของมุมหนึ่งร้อยสี่สิบองศา</title>
        <desc id="reference-angle-desc">แขนปลายของมุมหนึ่งร้อยสี่สิบองศาอยู่ในควอดแรนต์ที่สอง และทำมุมสี่สิบองศากับแกนเอ็กซ์ด้านลบซึ่งอยู่ใกล้ที่สุด</desc>
        <line className={styles.unitAxis} x1="48" y1="200" x2="382" y2="200" />
        <line className={styles.unitAxis} x1="215" y1="34" x2="215" y2="366" />
        <circle className={styles.unitRing} cx="215" cy="200" r="132" />
        <line className={styles.referenceNearestAxis} x1="215" y1="200" x2="83" y2="200" />
        <path className={styles.referenceRay} d="M215 200 L114 115" />
        <path className={styles.referenceMainArc} d="M277 200 A62 62 0 0 0 168 160" />
        <path className={styles.referenceSmallArc} d="M155 200 A60 60 0 0 1 169 161" />
        <circle className={styles.unitFocusPoint} cx="114" cy="115" r="7" />
        <text className={styles.referenceThetaLabel} x="226" y="146">θ = 140°</text>
        <text className={styles.referenceAlphaLabel} x="128" y="177">α = 40°</text>
        <text className={styles.referenceAxisDegree} x="365" y="222">0°</text>
        <text className={styles.referenceAxisDegree} x="53" y="222">180°</text>
        <text className={styles.referenceAxisDegree} x="226" y="61">90°</text>
        <text className={styles.referenceAxisDegree} x="226" y="353">270°</text>
        <text className={styles.unitCoordinate} x="68" y="100">แขนปลายของมุม</text>
      </svg>
      <figcaption>
        <h3>มุมเกิน 90° ให้ดู “แขนปลาย” ไม่ต้องเริ่มคิดใหม่</h3>
        <ol>
          <li><span>1</span><p>กางมุมจากแกน <MathText value="x" /> บวก จะเห็นว่า <MathText value="140°" /> ไปหยุดในควอดแรนต์ II</p></li>
          <li><span>2</span><p>หาแกน <MathText value="x" /> ที่อยู่ใกล้แขนปลายที่สุด กรณีนี้คือแกนด้าน <MathText value="180°" /></p></li>
          <li><span>3</span><p>มุมเล็กที่เหลือคือ <MathText value="α=180°−140°=40°" /> ซึ่งเรียกว่า <strong>มุมอ้างอิง</strong></p></li>
        </ol>
        <div className={styles.referenceResult}>
          <MathExpression value="sin140°=sin40°" />
          <MathExpression value="cos140°=−cos40°" />
          <MathExpression value="tan140°=−tan40°" />
        </div>
        <p>ขนาดของค่ามาจากมุม <MathText value="40°" /> ส่วนเครื่องหมายมาจากพิกัดในควอดแรนต์ II: <MathText value="y>0" /> แต่ <MathText value="x<0" /></p>
      </figcaption>
    </figure>
  )
}

const QUADRANTS = [
  ['I', '0 ถึง π/2', '+', '+', '+'],
  ['II', 'π/2 ถึง π', '+', '−', '−'],
  ['III', 'π ถึง 3π/2', '−', '−', '+'],
  ['IV', '3π/2 ถึง 2π', '−', '+', '−'],
]

const STANDARD_ANGLES = [
  ['0°', '0', '1', '0', '0'],
  ['30°', 'π/6', '√3/2', '1/2', '√3/3'],
  ['45°', 'π/4', '√2/2', '√2/2', '1'],
  ['60°', 'π/3', '1/2', '√3/2', '√3'],
  ['90°', 'π/2', '0', '1', 'ไม่นิยาม'],
]

function WorkedExample({ prompt, steps, answer }: { prompt: string; steps: string[]; answer: string }) {
  return (
    <article className={styles.unitWorkedExample}>
      <h4><MathText value={prompt} /></h4>
      <ol>{steps.map((step, index) => <li key={step}><span>{index + 1}</span><MathText value={step} /></li>)}</ol>
      <p><Check aria-hidden="true" /><strong><MathText value={answer} /></strong></p>
    </article>
  )
}

export default function UnitCircleGuide() {
  return (
    <section id="unit-circle" className={styles.unitCircleGuide}>
      <div className={styles.sectionHeading}>
        <CircleDot aria-hidden="true" />
        <div><span>ฐานของตรีโกณทั้งหมด</span><h2>วงกลมหนึ่งหน่วย: อ่านค่าให้เป็น ไม่ต้องท่องทั้งวง</h2></div>
      </div>

      <p className={styles.coreLead}>
        วงกลมหนึ่งหน่วยคือวงกลมศูนย์กลางที่จุดกำเนิดและมีรัศมี 1 ทุกมุม <MathText value="θ" /> จึงแทนด้วยจุดเดียวบนวงกลม
        เมื่อจำได้ว่าแกนนอนคือโคไซน์และแกนตั้งคือไซน์ เราจะหาเครื่องหมาย ค่ามุมมาตรฐาน และมุมที่หมุนเกินหนึ่งรอบได้จากภาพเดียว
      </p>

      <CoordinateProjectionFigure />

      <UnitCircleFigure />

      <div className={styles.unitCoordinateRules}>
        <div><strong>พิกัดแนวนอน</strong><MathExpression value="x=cosθ" /><p>มองระยะซ้าย–ขวาจากจุดกำเนิด</p></div>
        <div><strong>พิกัดแนวตั้ง</strong><MathExpression value="y=sinθ" /><p>มองระยะขึ้น–ลงจากจุดกำเนิด</p></div>
        <div><strong>ความชันของรัศมี</strong><MathExpression value="tanθ=y/x=sinθ/cosθ" /><p>นิยามเมื่อ <MathText value="cosθ≠0" /></p></div>
      </div>

      <div className={styles.coreUnit}>
        <div className={styles.coreUnitHeading}>
          <div><span>เริ่มจากพิกัด</span><h3>ทำไมเครื่องหมายจึงเปลี่ยนตามควอดแรนต์</h3></div>
          <p>ไม่ต้องท่องคำช่วยจำอย่างเดียว ให้ดูเครื่องหมายของพิกัด <MathText value="(x,y)" /> ก่อน เพราะ <MathText value="cosθ=x" /> และ <MathText value="sinθ=y" /> ส่วน <MathText value="tanθ=y/x" /></p>
        </div>
        <div className={styles.quadrantTable} role="table" aria-label="เครื่องหมายฟังก์ชันตรีโกณในแต่ละควอดแรนต์">
          <div role="row" className={styles.unitTableHead}><span role="columnheader">ควอดแรนต์</span><span role="columnheader">ช่วงมุม</span><span role="columnheader">sin</span><span role="columnheader">cos</span><span role="columnheader">tan</span></div>
          {QUADRANTS.map((row) => <div role="row" key={row[0]}>{row.map((cell, index) => <span role="cell" data-sign={index > 1 ? cell : undefined} key={`${row[0]}-${index}`}><MathText value={cell} /></span>)}</div>)}
        </div>
      </div>

      <div className={styles.coreUnit}>
        <div className={styles.coreUnitHeading}>
          <div><span>จำเพียงควอดแรนต์ที่หนึ่ง</span><h3>มุมมาตรฐาน 0°, 30°, 45°, 60°, 90°</h3></div>
          <p>ค่าขนาดของทุกควอดแรนต์ย้อนกลับมาที่ห้ามุมนี้ได้ ค่าไซน์เรียง <MathText value="0,1/2,√2/2,√3/2,1" /> และค่าโคไซน์เรียงย้อนกลับ</p>
        </div>
        <div className={styles.standardAngleTable} role="table" aria-label="ค่าตรีโกณของมุมมาตรฐานในควอดแรนต์ที่หนึ่ง">
          <div role="row" className={styles.unitTableHead}><span role="columnheader">องศา</span><span role="columnheader">เรเดียน</span><span role="columnheader">cos θ</span><span role="columnheader">sin θ</span><span role="columnheader">tan θ</span></div>
          {STANDARD_ANGLES.map((row) => <div role="row" key={row[0]}>{row.map((cell, index) => <span role="cell" key={`${row[0]}-${index}`}><MathText value={cell} /></span>)}</div>)}
        </div>
        <p className={styles.unitMemory}><Triangle aria-hidden="true" /><span><strong>จำจากสามเหลี่ยมก็ได้</strong> มุม 30° ใช้สามเหลี่ยมด้าน <MathText value="1:√3:2" /> และมุม 45° ใช้สามเหลี่ยมด้าน <MathText value="1:1:√2" /> แล้วใช้ <MathText value="sin=ข้าม/ฉาก, cos=ชิด/ฉาก, tan=ข้าม/ชิด" /></span></p>
      </div>

      <div className={styles.coreUnit}>
        <div className={styles.coreUnitHeading}>
          <div><span>ใช้ได้กับมุมทุกขนาด</span><h3>หามุมอ้างอิง แล้วใส่เครื่องหมายทีหลัง</h3></div>
          <p>สำหรับมุมที่ไม่ได้อยู่บนแกน มุมอ้างอิงคือมุมแหลมระหว่างแขนปลายของมุมกับแกน <MathText value="x" /> ที่ใกล้ที่สุด ค่าขนาดของ sin, cos และ tan มาจากมุมอ้างอิง ส่วนเครื่องหมายมาจากควอดแรนต์</p>
        </div>
        <ReferenceAngleFigure />
        <ol className={styles.referenceAngleFlow}>
          <li><span>1</span><div><strong>ลดมุมให้อยู่ในหนึ่งรอบ</strong><p>บวกหรือลบ <MathText value="360°" /> หรือ <MathText value="2π" /> จนได้มุมในช่วง <MathText value="0≤θ<2π" /></p></div></li>
          <li><span>2</span><div><strong>ระบุควอดแรนต์</strong><p>ดูตำแหน่งแขนปลายของมุม ไม่ดูเพียงค่าที่เครื่องคิดเลขแสดง</p></div></li>
          <li><span>3</span><div><strong>วัดจากแกน x ที่ใกล้ที่สุด</strong><p><MathText value="QII: 180°−θ, QIII: θ−180°, QIV: 360°−θ" /> หรือในหน่วยเรเดียน <MathText value="π−θ, θ−π, 2π−θ" /></p></div></li>
          <li><span>4</span><div><strong>หาค่าขนาด แล้วใส่เครื่องหมาย</strong><p>ใช้ตารางมุมมาตรฐาน จากนั้นใช้เครื่องหมายของควอดแรนต์</p></div></li>
        </ol>
      </div>

      <div className={styles.unitExamples}>
        <WorkedExample prompt="หา sin150°" steps={['แขนปลายอยู่ QII', 'แกน x ที่ใกล้ที่สุดคือ 180° จึงได้มุมอ้างอิง 180°−150°=30°', 'พิกัด y เป็นบวกใน QII และ sin30°=1/2']} answer="sin150°=1/2" />
        <WorkedExample prompt="หา cos240°" steps={['แขนปลายอยู่ QIII', 'แกน x ที่ใกล้ที่สุดคือ 180° จึงได้มุมอ้างอิง 240°−180°=60°', 'พิกัด x เป็นลบใน QIII และ cos60°=1/2']} answer="cos240°=−1/2" />
        <WorkedExample prompt="หา tan315°" steps={['แขนปลายอยู่ QIV', 'แกน x ที่ใกล้ที่สุดคือ 360° จึงได้มุมอ้างอิง 360°−315°=45°', 'y เป็นลบ แต่ x เป็นบวก จึงได้ tan เป็นลบ']} answer="tan315°=−1" />
      </div>

      <div className={styles.unitCircleChecks}>
        <div><Compass aria-hidden="true" /><p><strong>มุมติดลบ</strong> หมุนตามเข็มนาฬิกา เช่น <MathText value="−π/3" /> อยู่ตำแหน่งเดียวกับ <MathText value="5π/3" /></p></div>
        <div><RotateCcw aria-hidden="true" /><p><strong>มุมร่วมปลาย</strong> <MathText value="θ, θ+2πk" /> ให้จุดเดียวกันบนวงกลม เมื่อ <MathText value="k∈Z" /></p></div>
        <div><Triangle aria-hidden="true" /><p><strong>แกนต้องระวัง</strong> เมื่อ <MathText value="cosθ=0" /> จะได้ <MathText value="tanθ" /> ไม่นิยาม เพราะเป็นการหารด้วยศูนย์</p></div>
      </div>
    </section>
  )
}
