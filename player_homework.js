//使用者觸發click事件,則播放音樂
var myMusic = document.getElementById("myMusic");
var volumeControl = document.getElementById("volumeControl");
var information = document.getElementById("information");
var progressBar = document.getElementById("progressBar");
var musicList = document.getElementById("musicList");
var functionButtons = document.getElementById("functionButtons");

var txtVolume = volumeControl.children[3];
var rangeVolume = volumeControl.children[0];

var musicDuration = information.children[0];
var playStatus = information.children[1];
var btnPlay = functionButtons.children[0];

var infoStatus = information.children[2];
/////////////////////////////////////


// function musicStatus() {
//   if (infoStatus.innerText == "單首循環") {
//     changeMusic(0);
//   } else if (infoStatus.innerText == "隨機播放") {
//     var n = Math.floor(Math.random() * musicList.length); //隨機在musicList中選擇一首歌
//     changeMusic(n - musicList.selectedIndex);
//   } else if (
//     infoStatus.innerText == "全歌曲循環" &&
//     musicList.length == musicList.selectedIndex + 1
//   ) {
//     changeMusic(0 - musicList.selectedIndex);
//   } else if (musicList.length == musicList.selectedIndex + 1) {
//     //是否為最後一首歌
//     stopMusic();
//   } else {
//     //不是最後一首歌就播下一首歌
//     changeMusic(1);
//   }
// }


//0607edit
function musicStatus() {
  if (infoStatus.innerText == "單首循環") {
    changeMusic(0);
  } else if (infoStatus.innerText == "隨機播放") {
    var n, total = musicList.length, current = musicList.selectedIndex;
    do {
      n = Math.floor(Math.random() * total);
    } while (n === current && total > 1);
    changeMusic(n - current);
  } else if (infoStatus.innerText == "全歌曲循環") {
    // 如果是最後一首，跳回第一首；否則播下一首
    if (musicList.selectedIndex === musicList.length - 1) {
      changeMusic(0 - musicList.selectedIndex);
    } else {
      changeMusic(1);
    }
  } else {
    // 正常模式
    if (musicList.selectedIndex === musicList.length - 1) {
      stopMusic();
    } else {
      changeMusic(1);
    }
  }
}



function clearLoopBtnSelected() {
  document.querySelector('.loop-one-btn').classList.remove('selected');
  document.querySelector('.random-btn').classList.remove('selected');
  document.querySelector('.loop-all-btn').classList.remove('selected');
}

function loopOne() {
  if (infoStatus.innerHTML == "單首循環") {
    infoStatus.innerHTML = "正常";
    clearLoopBtnSelected();
  } else {
    infoStatus.innerHTML = "單首循環";
    clearLoopBtnSelected();
    document.querySelector('.loop-one-btn').classList.add('selected');
  }
}

function setRandom() {
  if (infoStatus.innerHTML == "隨機播放") {
    infoStatus.innerHTML = "正常";
    clearLoopBtnSelected();
  } else {
    infoStatus.innerHTML = "隨機播放";
    clearLoopBtnSelected();
    document.querySelector('.random-btn').classList.add('selected');
  }
}

function loopAll() {
  if (infoStatus.innerHTML == "全歌曲循環") {
    infoStatus.innerHTML = "正常";
    clearLoopBtnSelected();
  } else {
    infoStatus.innerHTML = "全歌曲循環";
    clearLoopBtnSelected();
    document.querySelector('.loop-all-btn').classList.add('selected');
  }
}






// 加入如果是全歌曲循環的話，最後一首也要回到第一首
// 如果是單首循環的話，則播放原曲  
// 如果是隨機播放的話，則隨機選擇一首歌 
function changeMusic(n) {
  var i = musicList.selectedIndex; //目前選擇的音樂索引
  var total = musicList.length;
  var isLoopAll = infoStatus.innerHTML == "全歌曲循環";
  var isLoopOne = infoStatus.innerHTML == "單首循環";




   // n=0 代表使用者直接點選清單
  var nextIndex = (n === 0) ? i : i + n;

  if (n !== 0) {
    // 只有自動切歌或按上下首時才考慮隨機
    if (infoStatus.innerHTML == "隨機播放") {
      do {
        nextIndex = Math.floor(Math.random() * total);
      } while (nextIndex === i && total > 1);
    } else if (isLoopAll || isLoopOne) {
        // 單首循環或全部循環都要首尾相接
      if (nextIndex < 0) nextIndex = total - 1;
      if (nextIndex >= total) nextIndex = 0;
    } else {
      if (nextIndex < 0) nextIndex = 0;
      if (nextIndex >= total) nextIndex = total - 1;
    }
    musicList.selectedIndex = nextIndex;
  }



  myMusic.src = musicList.children[nextIndex].value;
  myMusic.title = musicList.children[nextIndex].innerText;
  musicList.children[nextIndex].selected = true;

  if (btnPlay.innerText == ";") {
  // 如果目前是播放狀態，切歌後自動播放
  myMusic.onloadeddata = function() {
    playMusic.call(btnPlay); // 保持 play/pause 圖示正確
  };
  } else {
  // 如果目前是暫停狀態，切歌後維持暫停，並同步圖示
  myMusic.onloadeddata = function() {
  playMusic.call(btnPlay); // 自動播放並同步圖示
  };
    }

  // if (btnPlay.innerText == ";") {
  //   myMusic.onloadeddata = playMusic;
  // }



}




//時間格式
function getTimeFormat(t) {
  var min = parseInt(t.toFixed(0) / 60);
  var sec = parseInt(t.toFixed(0) % 60);

  min = min < 10 ? "0" + min : min;
  sec = sec < 10 ? "0" + sec : sec;

  return min + ":" + sec;
}

function setProgress() {
  myMusic.currentTime = progressBar.value / 10000; //更新音樂的當前時間
}

//音樂播放時間
function setMusicDuration() {
  musicDuration.innerHTML =
    getTimeFormat(myMusic.currentTime) +
    " / " +
    getTimeFormat(myMusic.duration);

  progressBar.value = myMusic.currentTime * 10000; //更新進度條的值
  // console.log(progressBar.value);

  var w = (myMusic.currentTime / myMusic.duration) * 100; //計算進度條的百分比
  progressBar.style.backgroundImage = `linear-gradient(to right, rgba(223, 201, 76, 0.77) ${w}%,rgb(236,235,234) ${w}%)`;

  /////////////////////////////////////////////
  // if (myMusic.currentTime == myMusic.duration) {
  //   if (information.children[2].innerHTML == "單首循環") {
  //     changeMusic(0);
  //   } else if (musicList.length == musicList.selectedIndex + 1) {
  //     stopMusic();
  //   } else changeMusic(1); //自動播放下一首音樂
  // }
}

//目前歌曲的長度初始化
function ProgressInitial() {
  progressBar.max = myMusic.duration * 10000; //音樂的總長度
  setInterval(setMusicDuration, 10); //每秒更新一次音樂時間
}

setVolumeByRangeBar(); //初始化音量

//音量調整
function setVolumeByRangeBar() {
  //console.log(event.target.value);
  txtVolume.value = rangeVolume.value;
  myMusic.volume = txtVolume.value / 100; //真正寫入音量屬性值

  //塗音量條的顏色
  rangeVolume.style.backgroundImage = `linear-gradient(to right, rgb(106,90,205) ${rangeVolume.value}%,rgb(240, 240, 240) ${rangeVolume.value}%)`;
}

//音量調整
function changeVolume(v) {
  rangeVolume.value = parseInt(rangeVolume.value) + v;
  setVolumeByRangeBar();
}

//靜音 用if else語法
// function setMute() {
//     if(myMusic.muted){
//         myMusic.muted=false;
//     }
//     else{
//         myMusic.muted=true;
//     }
// }

//靜音
//Teachers's code
// function setMute() {
//   myMusic.muted = !myMusic.muted;
//   //event.target.innerHTML = event.target.innerHTML == "U" ? "V" : "U";
//   event.target.className = event.target.className == "setMute" ? "" : "setMute";
// }



function setMute() {
  const muteBtn = event.target;
  myMusic.muted = !myMusic.muted;
  if (myMusic.muted) {
    txtVolume.value = 0; // 顯示為 0
    muteBtn.innerHTML = "V"; // 靜音圖示
    muteBtn.classList.add("setMute");
  } else {
    txtVolume.value = rangeVolume.value; // 恢復顯示目前音量
    muteBtn.innerHTML = "U"; // 喇叭圖示
    muteBtn.classList.remove("setMute");
  }
}

//快轉倒轉
function changeTime(s) {
  myMusic.currentTime += s;
}

// 倒轉
// function prevTime() {
//     myMusic.currentTime -=5;

// }
// 快轉
// function nextTime() {
//     myMusic.currentTime +=5;
// }

function updateInfo(txt) {
  playStatus.innerHTML = txt;
}

//播放音樂
function playMusic() {
  myMusic.play();
  btnPlay.innerHTML = ";"; // 播放鈕顯示為暫停圖示
  btnPlay.onclick = pauseMusic; // 點擊後變成暫停
  updateInfo("目前播放" + myMusic.title + "..."); // 狀態顯示
  ProgressInitial();
}

//暫停音樂
function pauseMusic() {
  myMusic.pause();
  btnPlay.innerHTML = "4";
  btnPlay.onclick = playMusic;
  //playStatus.innerHTML = "音樂暫停...";
  updateInfo("音樂暫停...");
}

//音樂停止
function stopMusic() {
  //音樂要停下來 且 時間歸零
  myMusic.pause();
  myMusic.currentTime = 0;
  btnPlay.innerHTML = "4";
  btnPlay.onclick = playMusic; //恢復播放音樂的功能
  //playStatus.innerHTML = "音樂停止...";
  updateInfo("音樂停止...");
}
