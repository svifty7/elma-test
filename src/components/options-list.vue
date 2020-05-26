<template>
    <div class="create-task__list">
        <span class="create-task__list--label">Элементы списка</span>
        <label class="create-task__label" v-for="(item, index) in list" :key="index">
            <span class="create-task__label--row">
                <input type="text"
                       class="create-task__input"
                       :name="'task-list-item-' + index"
                       placeholder="Введите текст"
                       v-model="list[index]"
                >
                <button class="create-task__rm-input"
                        type="button"
                        @click.prevent="$emit('remove-option', index)"
                ></button>
            </span>
        </label>

        <button type="button" class="create-task__list__btn"
                @click.prevent="$emit('add-option')"
        >Добавить элемент</button>
    </div>
</template>

<script>
    export default {
        name: "options-list",
        props: ["list"]
    }
</script>
