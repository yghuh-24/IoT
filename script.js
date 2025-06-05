import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

const firebaseConfig = {
  apiKey: "AIzaSyAXZKdkx72F2GvM7qaynr5r9agAMAiVX2s",
  authDomain: "commonpjt-fd9ed.firebaseapp.com",
  databaseURL: "https://commonpjt-fd9ed-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "commonpjt-fd9ed",
  storageBucket: "commonpjt-fd9ed.firebasestorage.app",
  messagingSenderId: "653463134970",
  appId: "1:653463134970:web:8301b6f3a2bde8da201f43"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// 데이터 로딩
const dbRef = ref(database);
onValue(dbRef, (snapshot) => {
  const data = snapshot.val();
  displayFormattedSensorData(data);
}, handleError);

// 데이터 출력 함수
function displayFormattedSensorData(data) {
  const dataContainer = document.getElementById('data-container');
  const loadingElement = document.getElementById('loading');
  loadingElement.style.display = 'none';

  if (!data || typeof data !== 'object') {
    dataContainer.innerHTML = '<p class="no-data">No data found.</p>';
    return;
  }

  let html = '';

  for (const [moduleName, sensors] of Object.entries(data)) {
    html += `<div class="module-card">`;
    html += `<div class="module-header"><h2 class="module-title">${getModuleIcon(moduleName)} ${moduleName}</h2></div>`;
    html += `<div class="sensor-grid">`;

    for (const [key, value] of Object.entries(sensors)) {
      const label = getLocalizedSensorName(key);
      const formattedValue = formatSensorValue(value, key);

      html += `
        <div class="sensor-item">
          <div class="sensor-info">
            <div class="sensor-name">${getSensorIcon(key)} ${label}</div>
            <div class="sensor-value">${formattedValue}</div>
          </div>
        </div>`;
    }

    html += `</div></div>`; // sensor-grid & module-card
  }

  dataContainer.innerHTML = html;
}

// 에러 처리 함수
function handleError(error) {
  const dataContainer = document.getElementById('data-container');
  const loadingElement = document.getElementById('loading');
  loadingElement.style.display = 'none';
  dataContainer.innerHTML = `<p class="error">Error loading data: ${error.message}</p>`;
  console.error('Firebase error:', error);
}

// 센서 이름을 한국어로 변환
function getLocalizedSensorName(sensorKey) {
  console.log('Original sensor key:', sensorKey); // 디버깅 로그
  const name = sensorKey.toLowerCase();
  
  // 복합 센서 키 처리 (예: accel_x, gyro_z 등)
  if (name.includes('accel')) {
    let result;
    if (name.includes('_x') || name.includes('x')) result = '가속도계 X축';
    else if (name.includes('_y') || name.includes('y')) result = '가속도계 Y축';
    else if (name.includes('_z') || name.includes('z')) result = '가속도계 Z축';
    else result = '가속도계';
    console.log('Converted accel:', sensorKey, '->', result); // 디버깅 로그
    return result;
  }
  
  if (name.includes('gyro')) {
    let result;
    if (name.includes('_x') || name.includes('x')) result = '자이로스코프 X축';
    else if (name.includes('_y') || name.includes('y')) result = '자이로스코프 Y축';
    else if (name.includes('_z') || name.includes('z')) result = '자이로스코프 Z축';
    else result = '자이로스코프';
    console.log('Converted gyro:', sensorKey, '->', result); // 디버깅 로그
    return result;
  }
  
  if (name.includes('magnet')) {
    if (name.includes('_x') || name.includes('x')) return '자기계 X축';
    if (name.includes('_y') || name.includes('y')) return '자기계 Y축';
    if (name.includes('_z') || name.includes('z')) return '자기계 Z축';
    return '자기계';
  }
  
  // 기본 센서 매핑
  if (name.includes('temp')) return '온도';
  if (name.includes('humid')) return '습도';
  if (name.includes('pressure')) return '기압';
  if (name.includes('compass')) return '나침반';
  if (name.includes('led')) return 'LED';
  if (name.includes('light')) return '조명';
  if (name.includes('joy')) return '조이스틱';
  if (name.includes('motion')) return '움직임';
  if (name.includes('orientation')) return '방향';
  if (name.includes('pitch')) return '피치';
  if (name.includes('roll')) return '롤';
  if (name.includes('yaw')) return '요';

  // 매칭되지 않으면 원본 키를 그대로 반환
  console.log('No conversion found for:', sensorKey); // 디버깅 로그
  return sensorKey;
}

// 센서 값을 포맷 처리
function formatSensorValue(value, sensorName) {
  if (typeof value === 'object' && value !== null) {
    if ('x' in value && 'y' in value && 'z' in value) {
      return `X: ${value.x}, Y: ${value.y}, Z: ${value.z}`;
    }
    return JSON.stringify(value);
  }

  const name = sensorName.toLowerCase();

  if (name.includes('temp')) return `${value}°C`;
  if (name.includes('humid')) return `${value}%`;
  if (name.includes('pressure')) return `${value} hPa`;

  return value;
}

// 센서에 맞는 아이콘 반환
function getSensorIcon(sensorName) {
  const name = sensorName.toLowerCase();

  if (name.includes('temp')) return '🌡️';
  if (name.includes('humid')) return '💧';
  if (name.includes('pressure')) return '📊';
  if (name.includes('gyro')) return '🔄';
  if (name.includes('accel')) return '📈';
  if (name.includes('magnet')) return '🧭';
  if (name.includes('joy')) return '🕹️';
  if (name.includes('led')) return '💡';

  return '📌';
}

// 모듈에 맞는 아이콘 반환
function getModuleIcon(moduleName) {
  const icons = {
    'SenseHAT': '🎛️',
    'LED': '💡',
    'Temperature': '🌡️',
    'Humidity': '💧',
    'Pressure': '📊',
    'Motion': '🏃',
    'Light': '☀️',
    'default': '📱'
  };

  for (const [key, icon] of Object.entries(icons)) {
    if (moduleName.toLowerCase().includes(key.toLowerCase())) {
      return icon;
    }
  }
  return icons.default;
}