<template>
    <div class="person">
        <div class="person__wrap">
            <div class="person__info">
                <div class="person__name">asd</div>
            </div>
            <div class="person__tasks">
                <task></task>
            </div>
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

    export default {
        name: "person",
        components: { task }
    }
</script>

<style scoped>

</style>
