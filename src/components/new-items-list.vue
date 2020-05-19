<template>
    <div class="create-task__list">
        <label class="create-task__label">
            <span class="create-task__label--faker">Элементы списка</span>
            <input type="text"
                   class="create-task__input"
                   name="task-list-1"
                   placeholder="Введите текст"
            >
        </label>

        <button class="create-task__list__btn">Добавить элемент</button>
    </div>
</template>

<script>
    export default {
        name: "new-items-list"
    }
</script>
