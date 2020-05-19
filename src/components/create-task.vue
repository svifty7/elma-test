<template>
    <form class="create-task">
        <div class="create-task__title">Новая задача</div>
        <label class="create-task__label">
            <span class="create-task__label--faker">Название задачи</span>
            <input type="text"
                   class="create-task__input"
                   name="task-name"
                   placeholder="Название задачи"
            >
        </label>

        <label class="create-task__label">
            <span class="create-task__label--faker">Описание</span>
            <textarea class="create-task__textarea" placeholder="Описание задачи"></textarea>
        </label>

        <new-items-list></new-items-list>

        <button class="create-task__btn">Сохранить</button>
    </form>
</template>

<script>
    import newItemsList from "@/components/new-items-list";

    export default {
        name: "create-task",
        components: {
            newItemsList
        }
    }
</script>
