const historyDiv = document.getElementById("history");
const pastHistoryDiv = document.getElementById("pastHistory");
const historyDateInput = document.getElementById("historyDate");

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

const lastRecordDiv = document.getElementById("lastRecord");

let workouts = JSON.parse(localStorage.getItem("workouts")) || [];


// ==============================
// 운동 부위별 종목
// ==============================

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


// ==============================
// 저장
// ==============================

function save() {

    localStorage.setItem(
        "workouts",
        JSON.stringify(workouts)
    );
}


// ==============================
// 현지 날짜 YYYY-MM-DD
// ==============================

function getLocalDateString(date = new Date()) {

    const year = date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// ==============================
// 운동 기록 날짜
// ==============================

function getWorkoutDate(workout) {

    if (!workout.date) {
        return "";
    }

    const date =
        new Date(workout.date);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return getLocalDateString(date);
}


// ==============================
// 웨이트 / 유산소 입력 전환
// ==============================

function updateInputMode() {

    const isCardio =
        categorySelect.value === "유산소";

    weightFields.hidden = isCardio;
    cardioFields.hidden = !isCardio;

    if (isCardio) {

        startBtn.textContent =
            "➕ 유산소 기록 추가";

    } else {

        startBtn.textContent =
            "➕ 세트 추가";
    }
}


// ==============================
// 최근 운동 기록 표시
// ==============================

function showLastRecord() {

    if (!lastRecordDiv) {
        return;
    }

    const exercise =
        exerciseSelect.value;

    if (!exercise) {

        lastRecordDiv.textContent =
            "최근 기록이 없습니다.";

        return;
    }


    const previous =
        workouts
            .filter(workout =>
                workout.exercise === exercise
            )
            .sort((a, b) =>
                new Date(b.date) -
                new Date(a.date)
            )[0];


    if (!previous) {

        lastRecordDiv.textContent =
            "최근 기록이 없습니다.";

        return;
    }


    const date =
        new Date(previous.date);

    const dateText =
        `${date.getFullYear()}. ` +
        `${date.getMonth() + 1}. ` +
        `${date.getDate()}.`;


    if (previous.type === "cardio") {

        lastRecordDiv.textContent =
            `최근 기록: ${previous.duration}분 / ` +
            `${previous.distance}km · ${dateText}`;

    } else {

        lastRecordDiv.textContent =
            `최근 기록: ${previous.weight}kg × ` +
            `${previous.reps}회 · ${dateText}`;
    }
}


// ==============================
// 운동 기록 한 줄 생성
// ==============================

function createWorkoutRecord(
    workout,
    index,
    allowDelete = true
) {

    const record =
        document.createElement("div");

    record.className =
        "workout-record";


    const text =
        document.createElement("span");


    if (workout.type === "cardio") {

        const duration =
            Number(workout.duration) || 0;

        const distance =
            Number(workout.distance) || 0;

        text.textContent =
            `${workout.exercise} ` +
            `${duration}분 / ${distance}km`;

    } else {

        const weight =
            Number(workout.weight) || 0;

        const reps =
            Number(workout.reps) || 0;

        text.textContent =
            `${workout.exercise} ` +
            `${weight}kg × ${reps}`;
    }


    record.appendChild(text);


    if (allowDelete) {

        const deleteBtn =
            document.createElement("button");

        deleteBtn.textContent =
            "삭제";


        deleteBtn.addEventListener(
            "click",
            function () {

                removeWorkout(index);
            }
        );


        record.appendChild(
            deleteBtn
        );
    }


    return record;
}


// ==============================
// 오늘 기록 표시
// ==============================

function render() {

    historyDiv.innerHTML = "";

    const today =
        getLocalDateString();


    const todayWorkouts =
        workouts
            .map((workout, index) => ({
                workout,
                index
            }))
            .filter(item =>
                getWorkoutDate(
                    item.workout
                ) === today
            );


    if (todayWorkouts.length === 0) {

        historyDiv.textContent =
            "오늘 기록이 없습니다.";

        volumeSpan.textContent =
            "0";

        setsSpan.textContent =
            "0";

        prDiv.textContent =
            "아직 기록이 없습니다.";

        renderPastHistory();
        showLastRecord();

        return;
    }


    let volume = 0;
    let pr = 0;
    let weightSetCount = 0;


    todayWorkouts.forEach(item => {

        const w =
            item.workout;


        if (w.type !== "cardio") {

            const weight =
                Number(w.weight) || 0;

            const reps =
                Number(w.reps) || 0;


            volume +=
                weight * reps;

            weightSetCount++;


            if (weight > pr) {

                pr = weight;
            }
        }


        const record =
            createWorkoutRecord(
                w,
                item.index,
                true
            );


        historyDiv.appendChild(
            record
        );
    });


    volumeSpan.textContent =
        volume.toLocaleString();


    setsSpan.textContent =
        todayWorkouts.length;


    if (weightSetCount > 0) {

        prDiv.textContent =
            pr + " kg";

    } else {

        prDiv.textContent =
            "웨이트 기록이 없습니다.";
    }


    renderPastHistory();
    showLastRecord();
}


// ==============================
// 지난 운동 기록
// ==============================

function renderPastHistory() {

    const selectedDate =
        historyDateInput.value;

    pastHistoryDiv.innerHTML =
        "";


    if (!selectedDate) {

        pastHistoryDiv.textContent =
            "날짜를 선택해주세요.";

        return;
    }


    const selectedWorkouts =
        workouts
            .map((workout, index) => ({
                workout,
                index
            }))
            .filter(item =>
                getWorkoutDate(
                    item.workout
                ) === selectedDate
            );


    if (
        selectedWorkouts.length === 0
    ) {

        pastHistoryDiv.textContent =
            "선택한 날짜의 기록이 없습니다.";

        return;
    }


    // ==========================
    // 날짜별 운동 요약
    // ==========================

    let totalVolume = 0;
    let weightSets = 0;

    let cardioMinutes = 0;
    let cardioDistance = 0;


    selectedWorkouts.forEach(item => {

        const w =
            item.workout;


        if (w.type === "cardio") {

            cardioMinutes +=
                Number(w.duration) || 0;

            cardioDistance +=
                Number(w.distance) || 0;

        } else {

            const weight =
                Number(w.weight) || 0;

            const reps =
                Number(w.reps) || 0;


            totalVolume +=
                weight * reps;

            weightSets++;
        }
    });


    // ==========================
    // 요약 표시
    // ==========================

    const summary =
        document.createElement("div");

    summary.className =
        "workout-summary";


    const title =
        document.createElement("strong");

    title.textContent =
        "📊 운동 요약";


    const volumeText =
        document.createElement("p");

    volumeText.textContent =
        `총 운동량 : ` +
        `${totalVolume.toLocaleString()} kg`;


    const setText =
        document.createElement("p");

    setText.textContent =
        `웨이트 : ${weightSets}세트`;


    const cardioText =
        document.createElement("p");

    cardioText.textContent =
        `유산소 : ${cardioMinutes}분 / ` +
        `${cardioDistance.toFixed(1)}km`;


    summary.appendChild(title);
    summary.appendChild(volumeText);
    summary.appendChild(setText);
    summary.appendChild(cardioText);


    pastHistoryDiv.appendChild(
        summary
    );


    // ==========================
    // 개별 운동 기록
    // ==========================

    selectedWorkouts.forEach(item => {

        const record =
            createWorkoutRecord(
                item.workout,
                item.index,
                true
            );


        pastHistoryDiv.appendChild(
            record
        );
    });
}


// ==============================
// 기록 삭제
// ==============================

function removeWorkout(index) {

    workouts.splice(index, 1);

    save();
    render();
}


// ==============================
// 운동 목록 표시
// ==============================

function updateExerciseList() {

    const category =
        categorySelect.value;

    const keyword =
        searchExercise.value
            .trim()
            .toLowerCase();

    const list =
        exercisesByCategory[
            category
        ] || [];


    const filtered =
        list.filter(exercise =>
            exercise
                .toLowerCase()
                .includes(keyword)
        );


    exerciseSelect.innerHTML =
        "";


    filtered.forEach(exercise => {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            exercise;

        option.textContent =
            exercise;

        exerciseSelect.appendChild(
            option
        );
    });


    showLastRecord();
}


// ==============================
// 운동 부위 변경
// ==============================

categorySelect.addEventListener(
    "change",
    function () {

        searchExercise.value =
            "";

        updateExerciseList();
        updateInputMode();
    }
);


// ==============================
// 운동 검색
// ==============================

searchExercise.addEventListener(
    "input",
    function () {

        updateExerciseList();
    }
);


// ==============================
// 운동 종목 변경
// ==============================

exerciseSelect.addEventListener(
    "change",
    function () {

        showLastRecord();
    }
);


// ==============================
// 날짜 선택
// ==============================

historyDateInput.addEventListener(
    "change",
    function () {

        renderPastHistory();
    }
);


// ==============================
// 기록 추가
// ==============================

startBtn.addEventListener(
    "click",
    function () {

        const exercise =
            exerciseSelect.value;


        if (!exercise) {

            alert(
                "운동을 선택해주세요."
            );

            return;
        }


        // ======================
        // 유산소
        // ======================

        if (
            categorySelect.value ===
            "유산소"
        ) {

            const duration =
                Number(
                    durationInput.value
                );

            const distance =
                Number(
                    distanceInput.value
                );


            if (
                durationInput.value.trim() === "" ||
                !Number.isFinite(duration) ||
                duration <= 0
            ) {

                alert(
                    "운동 시간을 입력해주세요."
                );

                durationInput.focus();

                return;
            }


            if (
                distanceInput.value.trim() === "" ||
                !Number.isFinite(distance) ||
                distance < 0
            ) {

                alert(
                    "거리를 입력해주세요."
                );

                distanceInput.focus();

                return;
            }


            workouts.push({

                type: "cardio",

                exercise:
                    exercise,

                duration:
                    duration,

                distance:
                    distance,

                date:
                    new Date()
                        .toISOString()

            });


            save();
            render();


            durationInput.value =
                "";

            distanceInput.value =
                "";

            durationInput.focus();

            return;
        }


        // ======================
        // 웨이트
        // ======================

        const weight =
            Number(
                weightInput.value
            );

        const reps =
            Number(
                repsInput.value
            );


        if (
            weightInput.value.trim() === "" ||
            !Number.isFinite(weight) ||
            weight < 0
        ) {

            alert(
                "무게를 입력해주세요."
            );

            weightInput.focus();

            return;
        }


        if (
            repsInput.value.trim() === "" ||
            !Number.isInteger(reps) ||
            reps <= 0
        ) {

            alert(
                "횟수를 입력해주세요."
            );

            repsInput.focus();

            return;
        }


        workouts.push({

            type: "weight",

            exercise:
                exercise,

            weight:
                weight,

            reps:
                reps,

            date:
                new Date()
                    .toISOString()

        });


        save();
        render();


        // 무게는 유지
        // 횟수만 비움

        repsInput.value =
            "";

        repsInput.focus();
    }
);


// ==============================
// 휴식 타이머
// ==============================

let timer = null;


function startTimer(sec) {

    clearInterval(timer);

    let remain =
        sec;

    const timerText =
        document.getElementById(
            "timerText"
        );


    timerText.textContent =
        remain + "초";


    timer =
        setInterval(
            function () {

                remain--;


                if (remain <= 0) {

                    clearInterval(
                        timer
                    );

                    timer = null;

                    timerText.textContent =
                        "휴식 종료!";

                    return;
                }


                timerText.textContent =
                    remain + "초";

            },
            1000
        );
}


document
    .getElementById("timer60")
    .onclick =
    () => startTimer(60);


document
    .getElementById("timer90")
    .onclick =
    () => startTimer(90);


document
    .getElementById("timer120")
    .onclick =
    () => startTimer(120);


// ==============================
// 앱 시작
// ==============================

historyDateInput.max =
    getLocalDateString();

updateExerciseList();
updateInputMode();
render();
