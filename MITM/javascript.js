// Global variables untuk simulasi
let lita = null;
let rahma = null;
let attacker = null;
let step = 0;

class DiffieHellmanParticipant {
  constructor(name, p = 23, g = 5) {
    this.name = name;
    this.p = p;
    this.g = g;
    this.generateKeys();
  }

  generateKeys() {
    this.privateKey = Math.floor(Math.random() * (this.p - 2)) + 1;
    this.publicKey = this.modPow(this.g, this.privateKey, this.p);
    this.sharedSecret = null;
  }

  calculateSharedSecret(otherPublicKey) {
    this.sharedSecret = this.modPow(otherPublicKey, this.privateKey, this.p);
    return this.sharedSecret;
  }

  modPow(base, exponent, modulus) {
    let result = 1;
    base = base % modulus;

    while (exponent > 0) {
      if (exponent % 2 === 1) {
        result = (result * base) % modulus;
      }
      exponent = Math.floor(exponent / 2);
      base = (base * base) % modulus;
    }

    return result;
  }

  encryptMessage(message, key) {
    // Encode message to UTF-8 bytes first
    const utf8Bytes = new TextEncoder().encode(message);
    let encrypted = "";
    for (let i = 0; i < utf8Bytes.length; i++) {
      encrypted += String.fromCharCode((utf8Bytes[i] ^ key % 256) % 256);
    }
    // Convert to base64 safely
    return btoa(unescape(encodeURIComponent(encrypted)));
  }

  decryptMessage(encryptedMessage, key) {
    try {
      // Decode from base64 safely
      let encrypted = decodeURIComponent(escape(atob(encryptedMessage)));
      let decryptedBytes = [];
      for (let i = 0; i < encrypted.charCodeAt.length; i++) {
        decryptedBytes.push((encrypted.charCodeAt(i) ^ key % 256) % 256);
      }
      // Decode UTF-8 bytes back to string
      return new TextDecoder().decode(new Uint8Array(decryptedBytes));
    } catch (e) {
      return "Error: Gagal mendekripsi pesan";
    }
  }
}

class MITMAttacker {
  constructor(p = 23, g = 5) {
    this.p = p;
    this.g = g;
    this.generateKeys();
  }

  generateKeys() {
    this.privateKeyA = Math.floor(Math.random() * (this.p - 2)) + 1;
    this.privateKeyB = Math.floor(Math.random() * (this.p - 2)) + 1;
    this.publicKeyA = this.modPow(this.g, this.privateKeyA, this.p);
    this.publicKeyB = this.modPow(this.g, this.privateKeyB, this.p);
  }

  interceptKeys(litaPublicKey, rahmaPublicKey) {
    this.sharedSecretWithLita = this.modPow(
      litaPublicKey,
      this.privateKeyA,
      this.p
    );
    this.sharedSecretWithRahma = this.modPow(
      rahmaPublicKey,
      this.privateKeyB,
      this.p
    );

    return {
      toLita: this.publicKeyA,
      toRahma: this.publicKeyB,
    };
  }

  interceptMessage(encryptedMessage, fromLita = true) {
    if (fromLita) {
      let decrypted = this.decrypt(encryptedMessage, this.sharedSecretWithLita);
      return {
        decrypted: decrypted,
        reencrypted: this.encrypt(decrypted, this.sharedSecretWithRahma),
      };
    } else {
      let decrypted = this.decrypt(
        encryptedMessage,
        this.sharedSecretWithRahma
      );
      return {
        decrypted: decrypted,
        reencrypted: this.encrypt(decrypted, this.sharedSecretWithLita),
      };
    }
  }

  encrypt(message, key) {
    // Encode message to UTF-8 bytes first
    const utf8Bytes = new TextEncoder().encode(message);
    let encrypted = "";
    for (let i = 0; i < utf8Bytes.length; i++) {
      encrypted += String.fromCharCode((utf8Bytes[i] ^ key % 256) % 256);
    }
    // Convert to base64 safely
    return btoa(unescape(encodeURIComponent(encrypted)));
  }

  decrypt(encryptedMessage, key) {
    try {
      // Decode from base64 safely
      let encrypted = decodeURIComponent(escape(atob(encryptedMessage)));
      let decryptedBytes = [];
      for (let i = 0; i < encrypted.length; i++) {
        decryptedBytes.push((encrypted.charCodeAt(i) ^ key % 256) % 256);
      }
      // Decode UTF-8 bytes back to string
      return new TextDecoder().decode(new Uint8Array(decryptedBytes));
    } catch (e) {
      return "Error: Gagal mendekripsi pesan";
    }
  }

  modPow(base, exponent, modulus) {
    let result = 1;
    base = base % modulus;

    while (exponent > 0) {
      if (exponent % 2 === 1) {
        result = (result * base) % modulus;
      }
      exponent = Math.floor(exponent / 2);
      base = (base * base) % modulus;
    }

    return result;
  }
}

function addLog(message, type = "info") {
  const log = document.getElementById("log");
  const entry = document.createElement("div");
  entry.className = `log-entry log-${type}`;
  entry.innerHTML = message;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;
}

function updateUI() {
  if (lita) {
    document.getElementById("lita-private").textContent = lita.privateKey;
    document.getElementById("lita-public").textContent = lita.publicKey;
    document.getElementById("lita-secret").textContent =
      lita.sharedSecret || "-";
  }

  if (rahma) {
    document.getElementById("rahma-private").textContent = rahma.privateKey;
    document.getElementById("rahma-public").textContent = rahma.publicKey;
    document.getElementById("rahma-secret").textContent =
      rahma.sharedSecret || "-";
  }
}

function initializeParticipants() {
  addLog("🔑 FASE 1: Inisialisasi Peserta dimulai...", "info");

  lita = new DiffieHellmanParticipant("Lita");
  rahma = new DiffieHellmanParticipant("Rahma");
  attacker = new MITMAttacker();

  addLog(
    `👩‍💻 Lita - Private Key: ${lita.privateKey}, Public Key: ${lita.publicKey}`,
    "lita"
  );
  addLog(
    `👨‍💻 Rahma - Private Key: ${rahma.privateKey}, Public Key: ${rahma.publicKey}`,
    "rahma"
  );
  addLog(`🕵️ Ifan siap untuk menyerang...`, "attacker");

  updateUI();

  document.getElementById("step1").disabled = true;
  document.getElementById("step2").disabled = false;

  updateStats(0, 2, 0);
}

function performMITMAttack() {
  addLog("🚨 FASE 2: Serangan MITM dimulai!", "attacker");
  addLog(`🕵️ Ifan mencegat public key Lita: ${lita.publicKey}`, "attacker");
  addLog(`🕵️ Ifan mencegat public key Rahma: ${rahma.publicKey}`, "attacker");

  const interceptedKeys = attacker.interceptKeys(
    lita.publicKey,
    rahma.publicKey
  );

  addLog(
    `🕵️ Ifan mengirim fake public key ${interceptedKeys.toLita} ke Lita`,
    "attacker"
  );
  addLog(
    `🕵️ Ifan mengirim fake public key ${interceptedKeys.toRahma} ke Rahma`,
    "attacker"
  );

  lita.calculateSharedSecret(interceptedKeys.toLita);
  rahma.calculateSharedSecret(interceptedKeys.toRahma);

  addLog(`👩‍💻 Lita menghitung shared secret: ${lita.sharedSecret}`, "lita");
  addLog(`👨‍💻 Rahma menghitung shared secret: ${rahma.sharedSecret}`, "rahma");
  addLog(`🕵️ Ifan memiliki 2 shared secret:`, "attacker");
  addLog(`   - Dengan Lita: ${attacker.sharedSecretWithLita}`, "attacker");
  addLog(`   - Dengan Rahma: ${attacker.sharedSecretWithRahma}`, "attacker");

  updateUI();

  document.getElementById("step2").disabled = true;
  document.getElementById("step3").disabled = false;

  updateStats(0, 2, 50);
}

function exchangeMessages() {
  addLog("💬 FASE 3: Pertukaran pesan dimulai...", "info");

  const originalMessage = "Hello Rahma, ini pesan rahasia dari Lita! 🔐";
  addLog(`👩‍💻 Lita ingin mengirim: "${originalMessage}"`, "lita");

  const encryptedByLita = lita.encryptMessage(
    originalMessage,
    lita.sharedSecret
  );
  addLog(`📤 Lita mengirim pesan terenkripsi`, "lita");

  const intercepted = attacker.interceptMessage(encryptedByLita, true);
  addLog(
    `🕵️ Ifan mencegat dan membaca: "${intercepted.decrypted}"`,
    "attacker"
  );
  addLog(`🕵️ Ifan meneruskan pesan ke Rahma (re-encrypted)`, "attacker");

  const receivedByRahma = rahma.decryptMessage(
    intercepted.reencrypted,
    rahma.sharedSecret
  );
  addLog(`📥 Rahma menerima: "${receivedByRahma}"`, "rahma");

  // Tampilkan di UI
  document.getElementById("communication-area").style.display = "block";
  document.getElementById("lita-msg-content").innerHTML = `
            <div class="encrypted">Terenkripsi: ${encryptedByLita.substring(
              0,
              20
            )}...</div>
            <div class="decrypted">Asli: "${originalMessage}"</div>
        `;
  document.getElementById("rahma-msg-content").innerHTML = `
            <div class="decrypted">Diterima: "${receivedByRahma}"</div>
        `;

  // Rahma membalas
  setTimeout(() => {
    const replyMessage = "Hi Lita, pesan diterima dengan aman! 👍";
    addLog(`👨‍💻 Rahma membalas: "${replyMessage}"`, "rahma");

    const encryptedByRahma = rahma.encryptMessage(
      replyMessage,
      rahma.sharedSecret
    );
    const interceptedReply = attacker.interceptMessage(encryptedByRahma, false);

    addLog(
      `🕵️ Ifan juga membaca balasan Rahma: "${interceptedReply.decrypted}"`,
      "attacker"
    );

    const receivedByLita = lita.decryptMessage(
      interceptedReply.reencrypted,
      lita.sharedSecret
    );
    addLog(`📥 Lita menerima balasan: "${receivedByLita}"`, "lita");

    addLog("🚨 SERANGAN BERHASIL! Semua komunikasi telah disadap!", "attacker");

    updateStats(2, 2, 100);
  }, 2000);

  document.getElementById("step3").disabled = true;
}

function updateStats(messages, keys, success) {
  document.getElementById("messages-intercepted").textContent = messages;
  document.getElementById("keys-compromised").textContent = keys;
  document.getElementById("attack-success").textContent = success + "%";
}

function reset() {
  lita = null;
  rahma = null;
  attacker = null;

  document.getElementById("log").innerHTML =
    '<div class="log-entry log-info">📋 Simulasi di-reset. Klik "Inisialisasi Kunci" untuk memulai lagi.</div>';
  document.getElementById("communication-area").style.display = "none";

  document.getElementById("lita-private").textContent = "-";
  document.getElementById("lita-public").textContent = "-";
  document.getElementById("lita-secret").textContent = "-";
  document.getElementById("rahma-private").textContent = "-";
  document.getElementById("rahma-public").textContent = "-";
  document.getElementById("rahma-secret").textContent = "-";

  document.getElementById("step1").disabled = false;
  document.getElementById("step2").disabled = true;
  document.getElementById("step3").disabled = true;

  updateStats(0, 0, 0);
}

// Inisialisasi saat halaman dimuat
window.onload = function () {
  addLog(
    "🔐 Selamat datang di Simulasi Serangan MITM pada Diffie-Hellman!",
    "info"
  );
  addLog(
    "📚 Simulasi ini menunjukkan bagaimana penyerang dapat menyusup ke dalam pertukaran kunci.",
    "info"
  );
};
