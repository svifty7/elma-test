<template>
    <form class="create-user" @submit.prevent="addUser">
        <div class="create-user__title">Создание пользователя</div>
        <label class="create-user__label">
            <span class="create-user__label--faker">Имя</span>
            <input type="text"
                   class="create-user__input"
                   name="first-name"
                   placeholder="Иван"
                   ref="first_name"
                   required="required"
            >
        </label>
        <label class="create-user__label">
            <span class="create-user__label--faker">Фамилия</span>
            <input type="text"
                   class="create-user__input"
                   name="last-name"
                   placeholder="Иванов"
                   ref="last_name"
            >
        </label>
        <label class="create-user__label">
            <span class="create-user__label--faker">Фотография</span>
            <input type="text"
                   class="create-user__input"
                   name="last-name"
                   placeholder="Ссылка на аватар"
                   ref="image"
            >
        </label>

        <button class="create-user__btn">Добавить</button>
    </form>
</template>

<script>
    export default {
        name: "create-user",
        methods: {

            /**
             * Вызов метода для создания пользователя.
             * В параметре передается объект с именем, фамилией и ссылкой на аватар пользователя.
             */
            addUser() {
                const userInfo = {
                    first_name: this.$refs.first_name.value,
                    last_name: this.$refs.last_name.value,
                    image: this.$refs.image.value
                }

                this.$store.dispatch("createUser", userInfo);
            }
        }
    }
</script>
