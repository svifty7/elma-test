<template>
    <div class="persons">
        <person v-for="(user, index) in users" :key="index" :user="user"></person>
        <div class="person">
            <div class="person__wrap">
                <button class="person__btn"
                        @click.prevent="openModal"
                >Добавить пользователя</button>
            </div>
        </div>
    </div>
</template>

<script>
    import person from "@/components/person";

    export default {
        name: "persons",
        props: ["users"],
        components: { person },
        methods: {
            openModal() {
                this.$store.dispatch("toggleModal", "user-add")
            }
        }
    }
</script>
