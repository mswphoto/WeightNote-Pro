const historyDiv = document.getElementById("history");
const volumeSpan = document.getElementById("volume");
const setsSpan = document.getElementById("sets");
const prDiv = document.getElementById("pr");

const searchExercise = document.getElementById("searchExercise");
const exerciseSelect = document.getElementById("exercise");
const categorySelect = document.getElementById("category");

const weightInput = document.getElementById("weightInput");
const repsInput = document.getElementById("repsInput");
const startBtn = document.getElementById("startBtn");

let workouts = JSON.parse(localStorage.getItem("workouts")) || [];


// 운동 부위별 종목

const exercisesByCategory = {

    "가슴": [
        "벤치프레스",
        "인클라인 벤치프레스",
        "체스트프레스",
        "펙덱 플라이",
        "케이블 크로스오버"
    ],

    "등": [
        "랫풀다운",
        "시티드 로우",
        "케이블 로우",
        "바벨 로우",
        "덤벨 로우",
        "풀업"
    ],

    "하체": [
        "스쿼트",
        "레그프레스",
        "레그 익스텐션",
        "레그 컬",
        "루마니안 데드리프트",
        "힙 어브덕션",
        "힙 어덕션",
        "카프 레이즈"
    ],

    "어깨": [
        "숄더프레스",
        "덤벨 숄더프레스",
        "사이드 레터럴 레이즈",
        "프론트 레이즈",
        "리어 델트 플라이"
    ],

    "팔": [
        "바벨 컬",
        "덤벨 컬",
        "해머 컬",
        "케이블 컬",
        "트라이셉스 푸시다운",
        "오버헤드 트라이셉스 익스텐션"
    ],

    "복근": [
        "크런치",
        "레그레이즈",
        "케이블 크런치",
        "플랭크"
    ],

    "유산소": [
        "트레드밀",
        "사이클",
        "스텝밀",
        "일립티컬"
    ]
};


// 저장

function save() {
    localStorage.setItem("workouts", JSON.stringify(workouts));
}


// 운동 기록 화면

function render() {

    historyDiv.innerHTML = "";

    if (workouts.length === 0) {

        historyDiv.textContent = "아직 기록이 없습니다.";

        volumeSpan.textContent = "0";
        setsSpan.textContent = "0";

        prDiv.textContent = "아직 기록이 없습니다.";

        return;
    }

    let volume = 0;
    let pr = 0;

    workouts.forEach((w, index) => {

        const weight = Number(w.weight);
        const reps = Number(w.reps);

        volume += weight * reps;

        if (weight > pr) {
            pr = weight;
        }

        const record = document.createElement("div");

        record.className = "workout-record";


        const text = document.createElement("span");

        text.textContent =
            `${w.exercise} ${weight}kg × ${reps}`;


        const deleteBtn = document.createElement("button");

        deleteBtn.textContent = "삭제";

        deleteBtn.addEventListener("click", function () {
            removeWorkout(index);
        });


        record.appendChild(text);
        record.appendChild(deleteBtn);

        historyDiv.appendChild(record);
    });

    volumeSpan.textContent = volume;
    setsSpan.textContent = workouts.length;

    prDiv.textContent = pr + " kg";
}


// 기록 삭제

function removeWorkout(index) {

    workouts.splice(index, 1);

    save();
    render();
}


// 선택한 운동 부위의 종목 표시

function updateExerciseList() {

    const category = categorySelect.value;

    const keyword =
        searchExercise.value.trim().toLowerCase();

    const list =
        exercisesByCategory[category] || [];

    const filtered = list.filter(exercise =>
        exercise.toLowerCase().includes(keyword)
    );

    exerciseSelect.innerHTML = "";

    filtered.forEach(exercise => {

        const option =
            document.createElement("option");

        option.value = exercise;
        option.textContent = exercise;

        exerciseSelect.appendChild(option);
    });
}


// 운동 부위 변경

categorySelect.addEventListener("change", function () {

    searchExercise.value = "";

    updateExerciseList();
});


// 운동 검색

searchExercise.addEventListener("input", function () {

    updateExerciseList();
});


// 세트 추가

startBtn.addEventListener("click", function () {

    const exercise = exerciseSelect.value;

    const weight = Number(weightInput.value);
    const reps = Number(repsInput.value);


    if (!exercise) {

        alert("운동을 선택해주세요.");

        return;
    }


    if (
        weightInput.value.trim() === "" ||
        !Number.isFinite(weight) ||
        weight < 0
    ) {

        alert("무게를 입력해주세요.");

        weightInput.focus();

        return;
    }


    if (
        repsInput.value.trim() === "" ||
        !Number.isInteger(reps) ||
        reps <= 0
    ) {

        alert("횟수를 입력해주세요.");

        repsInput.focus();

        return;
    }


    workouts.push({
        exercise: exercise,
        weight: weight,
        reps: reps,
        date: new Date().toISOString()
    });


    save();
    render();


    // 다음 세트에서 같은 무게를 쉽게 사용하도록
    // 무게는 남기고 횟수만 비웁니다.

    repsInput.value = "";
    repsInput.focus();
});


// 휴식 타이머

let timer = null;

function startTimer(sec) {

    clearInterval(timer);

    let remain = sec;

    const timerText =
        document.getElementById("timerText");

    timerText.textContent = remain + "초";


    timer = setInterval(function () {

        remain--;

        if (remain <= 0) {

            clearInterval(timer);

            timer = null;

            timerText.textContent = "휴식 종료!";

            return;
        }

        timerText.textContent = remain + "초";

    }, 1000);
}


document.getElementById("timer60").onclick =
    () => startTimer(60);

document.getElementById("timer90").onclick =
    () => startTimer(90);

document.getElementById("timer120").onclick =
    () => startTimer(120);


// 앱 시작

updateExerciseList();
render();
