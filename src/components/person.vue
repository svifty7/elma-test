<template>
    <div class="person">
        <div class="person__wrap">
            <div class="person__info">
                <div class="person__name">Имя-имя Фамилия</div>
            </div>
            <SlickList class="person__tasks"
                       :lockAxis="'y'"
                       v-model="items"
            >
                <SlickItem v-for="(item, index) in items"
                           :index="index"
                           :key="index"
                >
                    <task :properties="item"></task>
                </SlickItem>
            </SlickList>
            <div class="person__footer">
                <label class="person__footer--label">
                    <input
                            ref=""
                            type="text"
                            class="person__footer--input"
                            placeholder="Название задачи"
                    >
                </label>
                <button class="person__footer--btn">Добавить</button>
            </div>
        </div>
    </div>
</template>

<script>
    import task from "@/components/task";
    import {SlickList, SlickItem} from 'vue-slicksort';

    export default {
        name: "person",
        components: {
            task,
            SlickList,
            SlickItem
        },
        data() {
            return {
                items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            };
        }
    }
</script>

<style scoped>

</style>
