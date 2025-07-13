const inputFields = document.getElementById("inputFields");
const qrType = document.getElementById("qrType");
const generateBtn = document.getElementById("generateBtn");
const qrCodeContainer = document.getElementById("qrcode");
const downloadBtn = document.getElementById("downloadBtn");

let qrCode = null;

qrType.addEventListener("change", updateFields);
generateBtn.addEventListener("click", generateQR);
downloadBtn.addEventListener("click", downloadQR);

function updateFields() {
  inputFields.innerHTML = '';
  qrCodeContainer.innerHTML = '';
  downloadBtn.classList.add("hidden");

  const type = qrType.value;
  if (type === 'text' || type === 'url') {
    inputFields.innerHTML = `<input type="text" id="data" placeholder="Enter ${type}" class="w-full p-2 border rounded" />`;
  } else if (type === 'upi') {
    inputFields.innerHTML = `
      <input type="text" id="upi" placeholder="UPI ID (e.g. xyz@okicici)" class="w-full p-2 border rounded" />
      <input type="text" id="name" placeholder="Payee Name" class="w-full p-2 border rounded" />
      <input type="number" id="amount" placeholder="Amount (optional)" class="w-full p-2 border rounded" />
    `;
  } else if (type === 'wifi') {
    inputFields.innerHTML = `
      <input type="text" id="ssid" placeholder="WiFi SSID" class="w-full p-2 border rounded" />
      <input type="text" id="password" placeholder="Password" class="w-full p-2 border rounded" />
    `;
  } else if (type === 'vcard') {
    inputFields.innerHTML = `
      <input type="text" id="fullname" placeholder="Full Name" class="w-full p-2 border rounded" />
      <input type="text" id="phone" placeholder="Phone Number" class="w-full p-2 border rounded" />
      <input type="email" id="email" placeholder="Email" class="w-full p-2 border rounded" />
    `;
  }
}

function generateQR() {
  qrCodeContainer.innerHTML = '';
  let data = '';

  switch (qrType.value) {
    case 'text':
    case 'url':
      data = document.getElementById('data').value;
      break;
    case 'upi':
      const upi = document.getElementById('upi').value;
      const name = document.getElementById('name').value;
      const amount = document.getElementById('amount').value;
      data = `upi://pay?pa=${upi}&pn=${name}&am=${amount}`;
      break;
    case 'wifi':
      const ssid = document.getElementById('ssid').value;
      const password = document.getElementById('password').value;
      data = `WIFI:S:${ssid};T:WPA;P:${password};;`;
      break;
    case 'vcard':
      const fullname = document.getElementById('fullname').value;
      const phone = document.getElementById('phone').value;
      const email = document.getElementById('email').value;
      data = `BEGIN:VCARD\nVERSION:3.0\nFN:${fullname}\nTEL:${phone}\nEMAIL:${email}\nEND:VCARD`;
      break;
  }

  qrCode = new QRCodeStyling({
    width: 256,
    height: 256,
    type: "canvas",
    data: data,
    image: "",
    dotsOptions: {
      color: "#000",
      type: "rounded"
    },
    backgroundOptions: {
      color: "#ffffff"
    }
  });

  qrCode.append(qrCodeContainer);
  downloadBtn.classList.remove("hidden");
}

function downloadQR() {
  if (qrCode) {
    qrCode.download({ name: "qr-tools-hub", extension: "png" });
  }
}

// Dark mode toggle
document.getElementById("toggleMode").addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
});

// Initialize on load
updateFields();
