<template>
    <div class="create-task__list">
        <span class="create-task__list--label">Элементы списка</span>
        <label class="create-task__label" v-for="(item, index) in list" :key="index">
            <input type="text"
                   class="create-task__input"
                   :name="'task-list-' + index"
                   placeholder="Введите текст"
                   v-model="list[index]"

            >
        </label>

        <button class="create-task__list__btn"
                @click.prevent="$emit('addOption')"
        >Добавить элемент</button>
    </div>
</template>

<script>
    export default {
        name: "options-list",
        props: ["list"],
        created() {
            this.options = this.list;
        }
    }
</script>
