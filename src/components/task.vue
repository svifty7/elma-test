<template>
    <div class="task">
        <div class="task__name">Task name</div>

        <div class="task__desc">Task desc task desc task desc task desc task desc task desc task
            desc task desc
        </div>

        <ul v-if="properties % 2 === 0" class="task__list">
            <li>task list item</li>
            <li>task list item</li>
            <li>task list item list item list item list item</li>
        </ul>

        <div class="task__persons">
            <div class="task__person" :style="{ backgroundImage: `url()` }">A</div>
        </div>

        <div class="task__date">21.09.2020</div>
    </div>
</template>

<script>
    export default {
        name: "task",
        props: ["properties"]
    }
</script>
