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
                       autocomplete="off"
                >
                <button class="create-task__rm-input"
                        type="button"
                        v-if="notLastItem"
                        @click.prevent="$emit('remove-option', index)"
                ></button>
            </span>
        </label>

        <button type="button" class="create-task__list__btn"
                @click.prevent="$emit('add-option')"
        >Добавить элемент
        </button>
    </div>
</template>

<script>
    export default {
        name: "options-list",
        props: ["list"],
        computed: {

            /**
             * Проверяет список элементов.
             * Если элементов больше одного или единственный элемент не равен пустой строке, то возвращается "true".
             *
             * @return {boolean|boolean}
             */
            notLastItem() {
                return this.list.length > 1 || (this.list.length === 1 && this.list[0] !== "");
            }
        }
    }
</script>
