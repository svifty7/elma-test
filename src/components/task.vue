<template>
    <div v-if="true" class="task">
        <div class="task__name">Task name {{ item}}</div>

        <div class="task__desc">Task desc task desc task desc task desc task desc task desc task
            desc task desc
        </div>

        <div class="task__persons">
            <div class="task__person">a</div>
        </div>

        <div class="task__date">21.09.2020</div>
    </div>
    <div v-else class="task">
        <div class="task__name">Task name task name task name</div>

        <ul class="task__list">
            <li>task list item</li>
            <li>task list item</li>
            <li>task list item list item list item list item</li>
        </ul>

        <div class="task__persons">
            <div class="task__person">a</div>
        </div>

        <div class="task__date">21.09.2020</div>
    </div>
</template>

<script>
    export default {
        name: "task"
    }
</script>
