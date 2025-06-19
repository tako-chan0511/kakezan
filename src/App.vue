<template>
  <div class="controls">
    <button
      :class="{ active: gameMode === 'square' }"
      @click="gameMode = 'square'"
    >二乗数ゲーム</button>
    <button
      :class="{ active: gameMode === 'multiply' }"
      @click="gameMode = 'multiply'"
    >掛け算ゲーム</button>
  </div>

  <!-- 二乗数ゲーム -->
  <template v-if="gameMode === 'square'">
    <section>
      <h2>二桁の二乗数ゲーム</h2>
      <div class="inputs">
        <label>下限: <input type="number" v-model.number="low" /></label>
        <label>上限: <input type="number" v-model.number="high" /></label>
        <button @click="randomSquare">ランダム数字</button>
      </div>
      <div v-if="squareNumber !== null" class="result">
        <p class="qa">数字: {{ squareNumber }}</p>
        <button @click="showSquare">二乗を表示</button>
        <p v-if="squareAnswer !== null" class="qa">答え: {{ squareAnswer }}</p>
      </div>
    </section>
  </template>

  <!-- 掛け算ゲーム -->
  <template v-else>
    <section>
      <h2>二桁の掛け算ゲーム</h2>
      <button @click="randomMultiplication">ランダム掛け算</button>
      <div v-if="multA !== null && multB !== null" class="result">
        <p class="qa">問題: {{ multA }} × {{ multB }}</p>
        <button @click="showNextStep">補助ステップ</button>

        <!-- 補助ステップ表示用固定グリッド -->
        <div class="helper-grid">
          <!-- 上段: AB, CD -->
          <div
            v-for="(cell, idx) in row1"
            :key="`r1-${idx}`"
            class="cell"
          >
            {{ cell }}
          </div>
          <!-- 下段: EFG 左詰め -->
          <div
            v-for="(cell, idx) in row2"
            :key="`r2-${idx}`"
            class="cell"
          >
            {{ cell }}
          </div>
        </div>

        <button @click="showMultiplicationAnswer">答え</button>
        <p v-if="multAnswer !== null" class="qa">答え: {{ multAnswer }}</p>
      </div>
    </section>
  </template>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// モード切り替え
const gameMode = ref<'square' | 'multiply'>('square');

// 【1】二乗数ゲーム
const low = ref(10);
const high = ref(99);
const squareNumber = ref<number | null>(null);
const squareAnswer = ref<number | null>(null);

function randomSquare() {
  const min = Math.ceil(low.value);
  const max = Math.floor(high.value);
  squareNumber.value = Math.floor(Math.random() * (max - min + 1)) + min;
  squareAnswer.value = null;
}

function showSquare() {
  if (squareNumber.value !== null) {
    squareAnswer.value = squareNumber.value ** 2;
  }
}

// 【2】掛け算ゲーム
const multA = ref<number | null>(null);
const multB = ref<number | null>(null);
const steps = ref<{ tens: number; ones: number; cross: number } | null>(null);
const stepIndex = ref(0);
const multAnswer = ref<number | null>(null);

function randomMultiplication() {
  multA.value = Math.floor(Math.random() * 90) + 10;
  multB.value = Math.floor(Math.random() * 90) + 10;
  steps.value = null;
  stepIndex.value = 0;
  multAnswer.value = null;
}

function showNextStep() {
  if (multA.value !== null && multB.value !== null) {
    if (stepIndex.value === 0) {
      const aT = Math.floor(multA.value / 10);
      const aO = multA.value % 10;
      const bT = Math.floor(multB.value / 10);
      const bO = multB.value % 10;
      steps.value = {
        tens: aT * bT,
        ones: aO * bO,
        cross: aT * bO + aO * bT,
      };
    }
    stepIndex.value = Math.min(stepIndex.value + 1, 3);
  }
}

function showMultiplicationAnswer() {
  if (multA.value !== null && multB.value !== null) {
    multAnswer.value = multA.value * multB.value;
  }
}

// 補助ステップ文字列処理
const tensStr = computed(
  () => (steps.value ? String(steps.value.tens).padStart(2, '0') : '')
);
const onesStr = computed(
  () => (steps.value ? String(steps.value.ones).padStart(2, '0') : '')
);
const crossStr = computed(
  () => (steps.value ? String(steps.value.cross).padStart(3, '0') : '')
);

// グリッド表示用配列
const row1 = computed(() => {
  const cells = ['', '', '', ''];
  if (stepIndex.value >= 1 && steps.value) {
    cells[0] = tensStr.value.charAt(0);
    cells[1] = tensStr.value.charAt(1);
  }
  if (stepIndex.value >= 2 && steps.value) {
    cells[2] = onesStr.value.charAt(0);
    cells[3] = onesStr.value.charAt(1);
  }
  return cells;
});

const row2 = computed(() => {
  const cells = ['', '', '', ''];
  if (stepIndex.value >= 3 && steps.value) {
    const e = crossStr.value.charAt(0) === '0' ? '' : crossStr.value.charAt(0);
    cells[0] = e;
    cells[1] = crossStr.value.charAt(1);
    cells[2] = crossStr.value.charAt(2);
  }
  return cells;
});
</script>

<style scoped>
.controls {
  margin-bottom: 1rem;
}
.controls button {
  margin-right: 0.5rem;
  padding: 0.5rem 1rem;
}
.controls .active {
  background-color: #42b983;
  color: #fff;
}
section {
  margin-bottom: 2rem;
}
.inputs {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.result {
  margin-top: 1rem;
}
.result .qa {
  font-size: 3rem;
  margin: 0.5rem 0;
}
.helper-grid {
  display: grid;
  grid-template-columns: repeat(4, auto);
  grid-template-rows: repeat(2, auto);
  gap: 0.2rem;
  margin: 0.5rem 0;
}
.cell {
  width: 3rem;
  height: 3rem;
  border: 1px dashed #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  line-height: 1;
}
input {
  width: 4em;
}
button {
  cursor: pointer;
}
</style>
