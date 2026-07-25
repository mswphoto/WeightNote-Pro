const historyDiv = document.getElementById("history");
const volumeSpan = document.getElementById("volume");
const setsSpan = document.getElementById("sets");
const prDiv = document.getElementById("pr");

const searchExercise = document.getElementById("searchExercise");
const exerciseSelect = document.getElementById("exercise");
const categorySelect = document.getElementById("category");

const weightFields = document.getElementById("weightFields");
const cardioFields = document.getElementById("cardioFields");

const weightInput = document.getElementById("weightInput");
const repsInput = document.getElementById("repsInput");

const durationInput = document.getElementById("durationInput");
const distanceInput = document.getElementById("distanceInput");

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


// 웨이트 / 유산소 입력창 전환

function updateInputMode() {

    const isCardio = categorySelect.value === "유산소";

    weightFields.hidden = isCardio;
    cardioFields.hidden = !isCardio;

    if (isCardio) {
        startBtn.textContent = "➕ 유산소 기록 추가";
    } else {
        startBtn.textContent = "➕ 세트 추가";
    }
}


// 운동 기록 표시

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
    let weightSetCount = 0;

    workouts.forEach((w, index) => {

        const record = document.createElement("div");
        record.className = "workout-record";

        const text = document.createElement("span");


        // 유산소 기록

        if (w.type === "cardio") {

            const duration = Number(w.duration) || 0;
            const distance = Number(w.distance) || 0;

            text.textContent =
                `${w.exercise} ${duration}분 / ${distance}km`;

        }

        // 웨이트 기록
        // 기존 v4 기록도 자동 호환

        else {

            const weight = Number(w.weight) || 0;
            const reps = Number(w.reps) || 0;

            volume += weight * reps;
            weightSetCount++;

            if (weight > pr) {
                pr = weight;
            }

            text.textContent =
                `${w.exercise} ${weight}kg × ${reps}`;
        }


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


    if (weightSetCount > 0) {
        prDiv.textContent = pr + " kg";
    } else {
        prDiv.textContent = "웨이트 기록이 없습니다.";
    }
}


// 기록 삭제

function removeWorkout(index) {

    workouts.splice(index, 1);

    save();
    render();
}


// 운동 목록 표시

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

        const option = document.createElement("option");

        option.value = exercise;
        option.textContent = exercise;

        exerciseSelect.appendChild(option);
    });
}


// 운동 부위 변경

categorySelect.addEventListener("change", function () {

    searchExercise.value = "";

    updateExerciseList();
    updateInputMode();
});


// 운동 검색

searchExercise.addEventListener("input", function () {

    updateExerciseList();
});


// 기록 추가

startBtn.addEventListener("click", function () {

    const exercise = exerciseSelect.value;

    if (!exercise) {

        alert("운동을 선택해주세요.");

        return;
    }


    // 유산소

    if (categorySelect.value === "유산소") {

        const duration = Number(durationInput.value);
        const distance = Number(distanceInput.value);


        if (
            durationInput.value.trim() === "" ||
            !Number.isFinite(duration) ||
            duration <= 0
        ) {

            alert("운동 시간을 입력해주세요.");

            durationInput.focus();

            return;
        }


        if (
            distanceInput.value.trim() === "" ||
            !Number.isFinite(distance) ||
            distance < 0
        ) {

            alert("거리를 입력해주세요.");

            distanceInput.focus();

            return;
        }


        workouts.push({

            type: "cardio",
            exercise: exercise,
            duration: duration,
            distance: distance,
            date: new Date().toISOString()

        });


        save();
        render();


        durationInput.value = "";
        distanceInput.value = "";

        durationInput.focus();

        return;
    }


    // 웨이트

    const weight = Number(weightInput.value);
    const reps = Number(repsInput.value);


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

        type: "weight",
        exercise: exercise,
        weight: weight,
        reps: reps,
        date: new Date().toISOString()

    });


    save();
    render();


    // 같은 무게로 다음 세트 입력 가능

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
updateInputMode();
render();
