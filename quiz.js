// ===== QUIZ MODULE =====
const quizData = [
  {
    q: "Apa yang dimaksud dengan 'toleransi digital' dalam konteks Sila Pertama Pancasila?",
    options: [
      "Menyebarkan konten agama sebanyak mungkin di internet",
      "Menghormati perbedaan keyakinan dan tidak menyebarkan ujaran kebencian online",
      "Memblokir semua akun yang berbeda agama",
      "Hanya berinteraksi dengan sesama penganut agama yang sama"
    ],
    answer: 1,
    explain: "Toleransi digital berarti menghormati perbedaan keyakinan di ruang maya dan tidak menyebarkan konten SARA atau ujaran kebencian."
  },
  {
    q: "Cyberbullying termasuk pelanggaran nilai Pancasila sila ke berapa?",
    options: ["Sila 1 — Ketuhanan", "Sila 3 — Persatuan", "Sila 2 — Kemanusiaan", "Sila 5 — Keadilan"],
    answer: 2,
    explain: "Cyberbullying melanggar Sila Kedua karena merendahkan martabat manusia dan tidak mencerminkan perilaku yang adil dan beradab."
  },
  {
    q: "Berita yang belum terverifikasi kebenarannya disebut...",
    options: ["Breaking news", "Hoaks / misinformasi", "Citizen journalism", "Soft news"],
    answer: 1,
    explain: "Hoaks adalah informasi yang salah atau menyesatkan yang disebarkan tanpa verifikasi fakta. Selalu cek dulu di sumber terpercaya sebelum berbagi!"
  },
  {
    q: "Sikap yang paling mencerminkan Sila Keempat dalam berdiskusi di media sosial adalah...",
    options: [
      "Menyerang balik siapa pun yang berbeda pendapat",
      "Diam dan tidak pernah ikut berdiskusi",
      "Berdebat panjang sampai lawan menyerah",
      "Mendengarkan, berargumen dengan data, dan menghormati perbedaan pendapat"
    ],
    answer: 3,
    explain: "Sila Keempat mengajarkan musyawarah dan hikmat kebijaksanaan. Dalam diskusi digital, ini berarti mendengarkan dan berargumen secara rasional."
  },
  {
    q: "Kesenjangan digital di Indonesia terjadi karena...",
    options: [
      "Masyarakat Indonesia tidak suka teknologi",
      "Tidak meratanya akses internet dan literasi digital antara kota dan desa",
      "Internet Indonesia terlalu mahal untuk semua",
      "Pemerintah melarang penggunaan internet di daerah"
    ],
    answer: 1,
    explain: "Kesenjangan digital (digital divide) disebabkan oleh ketidakmerataan infrastruktur internet dan kurangnya literasi digital, terutama di daerah 3T."
  },
  {
    q: "Langkah pertama yang benar saat menerima berita viral di WhatsApp adalah...",
    options: [
      "Langsung forward ke semua grup",
      "Menyimpan dan tidak melakukan apa-apa",
      "Verifikasi ke sumber terpercaya seperti Kominfo atau media resmi",
      "Menghapus pesan tersebut"
    ],
    answer: 2,
    explain: "Sebelum menyebarkan berita, selalu verifikasi terlebih dahulu. Kamu bisa cek di Turnbackhoax.id, Cekfakta.com, atau situs Kominfo."
  },
  {
    q: "Konten yang memprovokasi konflik antar kelompok di media sosial bertentangan dengan Pancasila sila ke...",
    options: ["Sila 1", "Sila 2", "Sila 3", "Sila 4"],
    answer: 2,
    explain: "Konten provokatif yang memecah belah bertentangan dengan Sila Ketiga — Persatuan Indonesia. Kita harus menjaga persatuan di dunia nyata maupun digital."
  },
  {
    q: "Tindakan yang mencerminkan Sila Kelima di era digital adalah...",
    options: [
      "Memonopoli informasi untuk keuntungan pribadi",
      "Menyebarkan konten untuk audiens tertentu saja",
      "Membantu masyarakat kurang mampu mengakses internet dan informasi",
      "Menjual data pribadi pengguna internet"
    ],
    answer: 2,
    explain: "Keadilan sosial di era digital berarti memastikan semua orang memiliki akses yang setara terhadap informasi dan teknologi."
  },
  {
    q: "UU ITE di Indonesia mengatur tentang...",
    options: [
      "Harga paket internet yang adil",
      "Tata cara menggunakan media sosial yang benar",
      "Informasi dan transaksi elektronik termasuk larangan konten ilegal online",
      "Jam penggunaan internet untuk anak-anak"
    ],
    answer: 2,
    explain: "UU ITE (Informasi dan Transaksi Elektronik) mengatur informasi dan transaksi elektronik, termasuk larangan konten yang melanggar hukum seperti ujaran kebencian dan hoaks."
  },
  {
    q: "Warga digital yang baik dan Pancasilais ditandai oleh...",
    options: [
      "Memiliki banyak followers dan viral di semua platform",
      "Selalu mengungkapkan pendapat tanpa mempertimbangkan dampaknya",
      "Bertanggung jawab, kritis, toleran, dan menghargai keberagaman online",
      "Tidak pernah menggunakan media sosial sama sekali"
    ],
    answer: 2,
    explain: "Netizen Pancasilais adalah warga digital yang bertanggung jawab: bijak dalam berbagi, toleran terhadap perbedaan, dan menggunakan teknologi untuk kebaikan bersama."
  }
];

let currentQ = 0;
let score = 0;
let quizStarted = false;
let answered = false;

function initQuiz() {
  const startBtn = document.getElementById('startQuiz');
  if (startBtn) {
    startBtn.addEventListener('click', startQuiz);
  }
}

function startQuiz() {
  currentQ = 0;
  score = 0;
  quizStarted = true;
  answered = false;
  renderQuestion();
}

function renderQuestion() {
  const content = document.getElementById('quizContent');
  const counter = document.getElementById('quizCounter');
  const scoreEl = document.getElementById('quizScore');
  const progressBar = document.getElementById('quizProgressBar');

  if (currentQ >= quizData.length) {
    showResult();
    return;
  }

  answered = false;
  const q = quizData[currentQ];
  counter.textContent = `Soal ${currentQ + 1} dari ${quizData.length}`;
  scoreEl.textContent = `Skor: ${score}`;
  progressBar.style.width = `${(currentQ / quizData.length) * 100}%`;

  content.innerHTML = `
    <div class="quiz-question fade-up">${currentQ + 1}. ${q.q}</div>
    <div class="quiz-options" id="quizOptions">
      ${q.options.map((opt, i) => `
        <button class="quiz-option" data-idx="${i}" onclick="selectAnswer(${i})">
          ${String.fromCharCode(65 + i)}. ${opt}
        </button>
      `).join('')}
    </div>
    <div class="quiz-feedback" id="quizFeedback" style="display:none"></div>
    <div class="quiz-next" id="quizNext">
      <button class="btn btn-primary" onclick="nextQuestion()">
        ${currentQ === quizData.length - 1 ? 'Lihat Hasil 🏆' : 'Soal Berikutnya →'}
      </button>
    </div>
  `;
}

function selectAnswer(idx) {
  if (answered) return;
  answered = true;

  const q = quizData[currentQ];
  const options = document.querySelectorAll('.quiz-option');
  const feedback = document.getElementById('quizFeedback');
  const nextBtn = document.getElementById('quizNext');

  options.forEach(btn => { btn.disabled = true; });

  options[q.answer].classList.add('correct');

  if (idx === q.answer) {
    score++;
    options[idx].classList.add('correct');
    feedback.style.display = 'block';
    feedback.style.background = 'rgba(39,174,96,0.1)';
    feedback.style.border = '1px solid rgba(39,174,96,0.3)';
    feedback.style.borderRadius = 'var(--radius)';
    feedback.style.padding = '12px 16px';
    feedback.innerHTML = `✅ <strong>Benar!</strong> ${q.explain}`;
  } else {
    options[idx].classList.add('wrong');
    feedback.style.display = 'block';
    feedback.style.background = 'rgba(192,57,43,0.1)';
    feedback.style.border = '1px solid rgba(192,57,43,0.3)';
    feedback.style.borderRadius = 'var(--radius)';
    feedback.style.padding = '12px 16px';
    feedback.innerHTML = `❌ <strong>Kurang tepat.</strong> ${q.explain}`;
  }

  document.getElementById('quizScore').textContent = `Skor: ${score}`;
  nextBtn.classList.add('show');
}

function nextQuestion() {
  currentQ++;
  renderQuestion();
}

function showResult() {
  const content = document.getElementById('quizContent');
  const progressBar = document.getElementById('quizProgressBar');
  progressBar.style.width = '100%';
  document.getElementById('quizCounter').textContent = 'Quiz Selesai! 🎉';

  const pct = Math.round((score / quizData.length) * 100);
  let grade, msg, emoji;

  if (pct >= 90) {
    grade = 'Luar Biasa!';
    msg = 'Kamu adalah Warga Digital Pancasilais sejati! Pengetahuanmu tentang Pancasila di era digital sangat luar biasa.';
    emoji = '🏆';
  } else if (pct >= 70) {
    grade = 'Bagus!';
    msg = 'Pemahaman yang baik! Terus tingkatkan pengetahuanmu tentang nilai-nilai Pancasila di era digital.';
    emoji = '⭐';
  } else if (pct >= 50) {
    grade = 'Cukup Baik';
    msg = 'Lumayan! Ada beberapa nilai Pancasila yang perlu dipelajari lebih dalam. Coba ulangi materinya ya!';
    emoji = '📚';
  } else {
    grade = 'Perlu Belajar Lagi';
    msg = 'Jangan menyerah! Baca kembali materi setiap sila dan coba quiz ini lagi. Kamu pasti bisa!';
    emoji = '💪';
  }

  content.innerHTML = `
    <div class="quiz-result fade-up">
      <div class="score-circle">
        <span class="big-score">${score}</span>
        <small>dari 10</small>
      </div>
      <div style="font-size:2rem;margin-bottom:8px">${emoji}</div>
      <h3>${grade}</h3>
      <p>${msg}</p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="startQuiz()">Coba Lagi 🔄</button>
        <a href="#home" class="btn btn-outline">Ulangi Materi 📖</a>
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', initQuiz);