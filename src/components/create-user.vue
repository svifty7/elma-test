<template>
    <form class="create-user">
        <div class="create-user__title">Создание пользователя</div>
        <label class="create-user__label">
            <span class="create-user__label--faker">Имя</span>
            <input type="text"
                   class="create-user__input"
                   name="first-name"
                   placeholder="Иван"
            >
        </label>
        <label class="create-user__label">
            <span class="create-user__label--faker">Фамилия</span>
            <input type="text"
                   class="create-user__input"
                   name="last-name"
                   placeholder="Иванов"
            >
        </label>

        <button class="create-user__btn">Добавить</button>
    </form>
</template>

<script>
    export default {
        name: "create-user"
    }
</script>
