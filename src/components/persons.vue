<template>
    <div class="persons">
        <person v-for="(i, k) in 2" :key="k" :properties="i"></person>
        <div class="person">
            <div class="person__wrap">
                <button class="person__btn">Добавить пользователя</button>
            </div>
        </div>
    </div>
</template>

<script>
    import person from "@/components/person";

    export default {
        name: "persons",
        components: { person }
    }
</script>
