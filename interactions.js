// ===== INTERACTIONS MODULE =====

// ---- SILA 1: Comment Simulation ----
function initCommentSim() {
  const btns = document.querySelectorAll('.comment-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const feedback = document.getElementById('commentFeedback1');
      const type = btn.dataset.type;
      const text = btn.dataset.feedback;

      feedback.textContent = text;
      feedback.className = 'comment-feedback show';
      if (type === 'sopan') feedback.classList.add('fb-sopan');
      else if (type === 'netral') feedback.classList.add('fb-netral');
      else feedback.classList.add('fb-kasar');

      // highlight selected
      document.querySelectorAll('.comment-btn').forEach(b => b.style.opacity = '0.5');
      btn.style.opacity = '1';
    });
  });
}

// ---- SILA 2: Drag & Drop ----
let dragItem = null;

function initDragDrop() {
  const draggables = document.querySelectorAll('.draggable-comment');
  const dropAreas  = document.querySelectorAll('.drop-area');
  const pool       = document.getElementById('commentPool');
  const checkBtn   = document.getElementById('checkDrag');
  const resetBtn   = document.getElementById('resetDrag');

  if (!draggables.length) return;

  draggables.forEach(el => {
    el.addEventListener('dragstart', () => {
      dragItem = el;
      el.classList.add('dragging');
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('dragging');
      dragItem = null;
    });
  });

  // drop zones
  document.querySelectorAll('.drop-zone').forEach(zone => {
    const area = zone.querySelector('.drop-area');
    zone.addEventListener('dragover', e => {
      e.preventDefault();
      zone.classList.add('drag-over');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      if (dragItem) {
        area.appendChild(dragItem);
      }
    });
  });

  // pool also droppable
  if (pool) {
    pool.addEventListener('dragover', e => e.preventDefault());
    pool.addEventListener('drop', e => {
      e.preventDefault();
      if (dragItem) pool.appendChild(dragItem);
    });
  }

  checkBtn && checkBtn.addEventListener('click', checkDragAnswers);
  resetBtn && resetBtn.addEventListener('click', resetDrag);
}

function checkDragAnswers() {
  const baikArea  = document.getElementById('areaBaik');
  const toxicArea = document.getElementById('areaToxic');
  const result    = document.getElementById('dragResult');

  if (!baikArea || !toxicArea) return;

  const baikItems  = baikArea.querySelectorAll('.draggable-comment');
  const toxicItems = toxicArea.querySelectorAll('.draggable-comment');

  let correct = 0, total = 6;
  baikItems.forEach(el  => { if (el.dataset.type === 'baik')  correct++; else correct--; });
  toxicItems.forEach(el => { if (el.dataset.type === 'toxic') correct++; else correct--; });
  correct = Math.max(0, correct);

  result.className = `drag-result show ${correct >= 5 ? 'success' : 'partial'}`;
  result.innerHTML = correct >= 5
    ? `🎉 <strong>Luar biasa!</strong> Kamu berhasil mengidentifikasi ${correct} dari 6 komentar dengan benar! Kamu sudah memahami perbedaan komentar baik dan toxic.`
    : `⚠️ <strong>Kamu mendapat ${correct} dari 6 benar.</strong> Ada yang keliru. Perhatikan lagi: komentar baik = konstruktif & menghargai. Toxic = merendahkan & menyerang.`;
}

function resetDrag() {
  const pool = document.getElementById('commentPool');
  const result = document.getElementById('dragResult');
  const allComments = document.querySelectorAll('.draggable-comment');
  allComments.forEach(el => pool.appendChild(el));
  if (result) { result.className = 'drag-result'; result.innerHTML = ''; }
  document.getElementById('areaBaik').innerHTML  = '';
  document.getElementById('areaToxic').innerHTML = '';
}

// ---- SILA 3: Hoax Checker ----
const hoaxKeywords = [
  'hapus media sosial','vaksin','5g','pemerintah larang','alien','obat covid gratis',
  'presiden mundur','gempa besok','banjir bandang','uang gratis','kiamat','tipu','palsu',
  'konspirasi','rahasia','tersembunyi','dokumen bocor','intelijen','perang dunia'
];
const neutralKeywords = ['tips','cara','tutorial','resep','panduan'];

function initHoaxChecker() {
  const btn = document.getElementById('checkHoax');
  const input = document.getElementById('hoaxInput');
  if (!btn) return;

  btn.addEventListener('click', runHoaxCheck);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') runHoaxCheck(); });
}

function runHoaxCheck() {
  const input  = document.getElementById('hoaxInput');
  const result = document.getElementById('hoaxResult');
  const text   = input.value.trim().toLowerCase();

  if (!text) {
    result.className = 'hoax-result show warning';
    result.innerHTML = '<h4>⚠️ Masukkan judul berita dulu!</h4><p>Ketik judul berita yang ingin kamu cek.</p>';
    return;
  }

  const matchedHoax    = hoaxKeywords.filter(k => text.includes(k));
  const matchedNeutral = neutralKeywords.filter(k => text.includes(k));

  let level, html;

  if (matchedHoax.length >= 2 || (matchedHoax.length >= 1 && text.length < 30)) {
    level = 'danger';
    html  = `
      <h4>🚨 POTENSI HOAKS TINGGI</h4>
      <p>Berita ini mengandung beberapa kata yang sering digunakan dalam konten hoaks. Jangan bagikan sebelum memverifikasi di:</p>
      <ul style="margin-top:8px;padding-left:16px;font-size:0.82rem;color:var(--text-secondary)">
        <li>🔍 <strong>Turnbackhoax.id</strong> — Database hoaks resmi Kominfo</li>
        <li>🔍 <strong>Cekfakta.com</strong> — Cek fakta media terpercaya</li>
        <li>🔍 <strong>Kominfo.go.id</strong> — Situs resmi pemerintah</li>
      </ul>`;
  } else if (matchedHoax.length === 1 && !matchedNeutral.length) {
    level = 'warning';
    html  = `
      <h4>⚠️ PERLU VERIFIKASI</h4>
      <p>Berita ini mengandung beberapa kata yang perlu diwaspadai. Verifikasi terlebih dahulu sebelum dibagikan. Cek di sumber terpercaya!</p>`;
  } else {
    level = 'safe';
    html  = `
      <h4>✅ TAMPAK AMAN</h4>
      <p>Berdasarkan analisis kata kunci, berita ini tidak mengandung kata-kata hoaks umum. Namun tetap verifikasi ke sumber primer ya! Jangan lupa cek narasumber dan tanggal terbit.</p>`;
  }

  result.className = `hoax-result show ${level}`;
  result.innerHTML = html;
}

// ---- SILA 4: Forum Diskusi ----
const bannedWords = [
  'bangsat','brengsek','anjing','bajingan','babi','tolol','goblok','idiot',
  'bodoh','dungu','keparat','setan','sial','bego','kontol','kimak','kampret',
  'asu','cuki','jancok','fuck','shit','damn','wtf','hell'
];

const forumAvatars  = ['👨‍💼','👩‍🎓','🧑‍💻','👨‍🏫','👩‍💼','🧑‍🎤','👨‍🔬','👩‍🏫'];
const forumNames    = ['BudiSantoso','SitiRahayu','AhmadFauzi','DewiLestari','RahmatHidayat','NurAisyah'];
const autoReplies   = [
  'Setuju! Kita perlu bijak dalam menggunakan media sosial untuk urusan politik.',
  'Menurut saya, transparansi informasi sangat penting dalam era digital ini.',
  'Mari kita diskusikan ini dengan kepala dingin. Perbedaan pendapat adalah hal yang wajar.',
  'Yang penting adalah bagaimana kita menyampaikan pesan dengan sopan dan bertanggung jawab.',
  'Saya rasa kita perlu mengedepankan fakta daripada opini dalam diskusi ini.'
];

let forumMsgCount = 0;

function filterWords(text) {
  let filtered = text;
  let wasFiltered = false;
  bannedWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    if (regex.test(filtered)) {
      wasFiltered = true;
      filtered = filtered.replace(regex, '*'.repeat(word.length));
    }
  });
  return { text: filtered, wasFiltered };
}

function addForumMessage(text, type = 'user') {
  const msgs = document.getElementById('forumMessages');
  if (!msgs) return;

  const div = document.createElement('div');
  div.className = `forum-msg ${type === 'user' ? 'msg-user' : ''}`;
  forumMsgCount++;

  if (type === 'user') {
    const { text: filteredText, wasFiltered } = filterWords(text);
    div.innerHTML = `
      <span class="msg-avatar">🧑‍💻</span>
      <div class="msg-body">
        <strong>Kamu</strong>
        <p>${filteredText}${wasFiltered ? ' <span class="msg-filtered">[kata kasar telah disaring 🛡️]</span>' : ''}</p>
      </div>`;
  } else {
    const avatar = forumAvatars[Math.floor(Math.random() * forumAvatars.length)];
    const name   = forumNames[Math.floor(Math.random() * forumNames.length)];
    const reply  = autoReplies[Math.floor(Math.random() * autoReplies.length)];
    div.innerHTML = `
      <span class="msg-avatar">${avatar}</span>
      <div class="msg-body">
        <strong>${name}</strong>
        <p>${reply}</p>
      </div>`;
  }

  div.style.animation = 'slideIn 0.3s ease';
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function initForum() {
  const sendBtn = document.getElementById('forumSend');
  const input   = document.getElementById('forumInput');
  if (!sendBtn) return;

  sendBtn.addEventListener('click', sendForumMessage);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendForumMessage(); });
}

function sendForumMessage() {
  const input = document.getElementById('forumInput');
  const text  = input.value.trim();
  if (!text) return;

  addForumMessage(text, 'user');
  input.value = '';

  // Auto-reply after delay
  setTimeout(() => addForumMessage('', 'other'), 1200 + Math.random() * 800);
}

// ---- SILA 5: Donation Simulator ----
let totalDonation  = 0;
const TARGET       = 50000000;

function formatRupiah(num) {
  return 'Rp ' + num.toLocaleString('id-ID');
}

function addDonation(amount) {
  totalDonation += amount;
  if (totalDonation > TARGET) totalDonation = TARGET;

  const bar      = document.getElementById('donationBar');
  const total    = document.getElementById('donationTotal');
  const log      = document.getElementById('donationLog');
  const pct      = Math.min(100, (totalDonation / TARGET) * 100);

  if (bar)   bar.style.width   = pct + '%';
  if (total) total.textContent = `Terkumpul: ${formatRupiah(totalDonation)} (${pct.toFixed(1)}%)`;

  // Log entry
  if (log) {
    const entry  = document.createElement('div');
    entry.className = 'log-item';
    const names = ['Anonim','BudiS','SitiR','AhmadF','DewiL','RahmatH','NurA','WahyuP'];
    const name  = names[Math.floor(Math.random() * names.length)];
    entry.textContent = `❤️ ${name} berdonasi ${formatRupiah(amount)} — "Semangat untuk Indonesia yang lebih adil!"`;
    log.prepend(entry);
  }

  // Particle effect
  spawnParticle('❤️');

  // Completion message
  if (totalDonation >= TARGET) {
    setTimeout(() => {
      const log2 = document.getElementById('donationLog');
      if (log2) {
        const win = document.createElement('div');
        win.className = 'log-item';
        win.style.background = 'rgba(39,174,96,0.2)';
        win.style.fontWeight = '700';
        win.textContent = '🎉 Target tercapai! Terima kasih atas kepedulian kalian!';
        log2.prepend(win);
      }
    }, 300);
  }
}

function spawnParticle(emoji) {
  const el = document.createElement('div');
  el.className = 'donate-particle';
  el.textContent = emoji;
  const btn = document.querySelector('.donation-sim');
  if (btn) {
    const rect = btn.getBoundingClientRect();
    el.style.left = (rect.left + rect.width / 2) + 'px';
    el.style.top  = (rect.top + 40) + 'px';
  }
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

function initDonation() {
  const btns      = document.querySelectorAll('.donate-btn');
  const customBtn = document.getElementById('customDonate');
  const customInp = document.getElementById('customAmount');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      addDonation(parseInt(btn.dataset.amount));
    });
  });

  customBtn && customBtn.addEventListener('click', () => {
    const val = parseInt(customInp.value);
    if (val && val >= 1000) {
      addDonation(val);
      customInp.value = '';
    } else {
      customInp.style.borderColor = 'var(--red)';
      setTimeout(() => customInp.style.borderColor = '', 1000);
    }
  });
}

// ---- SILA 4: Polling ----
const pollData = {};

function initPolling() {
  document.querySelectorAll('.poll-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const pollItem = this.closest('.poll-item');
      const pollId   = pollItem.dataset.poll;
      const val      = this.dataset.value;

      // Deselect others in same poll
      pollItem.querySelectorAll('.poll-btn').forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');

      // Record vote
      if (!pollData[pollId]) pollData[pollId] = {};
      pollData[pollId][val] = (pollData[pollId][val] || 0) + 1;

      // Show result
      const result = document.getElementById(`pollResult${pollId}`);
      if (result) {
        const responses = {
          selalu: 'Keren! Kamu adalah pemeriksa fakta yang teladan 👍',
          kadang: 'Bagus! Coba jadikan kebiasaan untuk selalu cek fakta ya.',
          jarang: 'Masih bisa diperbaiki! Yuk mulai biasakan verifikasi dulu.',
          tidak: 'Hati-hati! Berbagi tanpa cek fakta bisa menyebarkan hoaks.',
          lapor: '🌟 Sikap terbaik! Pelaporan membantu platform menjaga keamanan.',
          dukung: '💚 Empati yang luar biasa! Korban butuh dukungan kita.',
          diam: '⚠️ Diam juga memperparah situasi. Coba berani speak up!',
          lanjut: '⚠️ Scroll tanpa bertindak membuat pelaku makin leluasa.',
          toleransi: '🕊️ Toleransi memang sering teruji di ruang digital kita.',
          kemanusiaan: '🤲 Cyberbullying memang merajalela dan melanggar nilai kemanusiaan.',
          persatuan: '🇮🇩 Hoaks dan fitnah memang sangat mengancam persatuan.',
          musyawarah: '🏛️ Debat kusir dan toxic debating melanggar nilai musyawarah mufakat.'
        };
        result.innerHTML = `<strong>Responsmu:</strong> ${responses[val] || 'Terima kasih atas pilihanmu!'}`;
        result.style.animation = 'fadeIn 0.3s ease';
      }
    });
  });
}

// ---- INITIALIZE ALL ----
document.addEventListener('DOMContentLoaded', () => {
  initCommentSim();
  initDragDrop();
  initHoaxChecker();
  initForum();
  initDonation();
  initPolling();
});