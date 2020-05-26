<template>
    <div class="task"
         @click="updateTask"
    >
        <div class="task__name">{{task.name}}</div>

        <div class="task__desc"
             v-if="task.desc"
        >{{task.desc}}
        </div>

        <ul v-if="task.list && task.list.length"
            class="task__list"
        >
            <li v-for="(listItem, index) in task.list"
                :key="index"
            >{{listItem}}
            </li>
        </ul>

        <div v-if="task.watchers && task.watchers.length"
             class="task__persons"
        >
            <div class="task__person"
                 v-for="(watcher, index) in task.watchers"
                 :key="index"
                 :title="watcher.name"
            >
                <span class="task__person--name">{{concatWatcherName(watcher.name)}}</span>
                <div class="task__person--img"
                     :style="{ backgroundImage: `url('${watcher.image}')` }"
                ></div>
            </div>
        </div>

        <div class="task__date">{{convertDate(task.date)}}</div>
    </div>
</template>

<script>
    export default {
        name: "task",
        props: ["task"],
        methods: {

            /**
             * Конвертация даты в формат ДД.ММ.ГГГГ.
             * На вход принимает строку даты в формате ISO.
             * Возвращает строку с "человеческой" датой.
             *
             * @param {string} dateString
             * @return {string}
             */
            convertDate(dateString) {
                const date = new Date(dateString);

                let day = date.getDate();
                let month = date.getMonth() + 1;
                let year = date.getFullYear();

                if (day < 10) {
                    day = "0" + day;
                }

                if (month < 10) {
                    month = "0" + month;
                }

                return day + "." + month + "." + year;
            },

            /**
             * Обрезка имени пользователя отслеживающего задачу до одной буквы, чтобы поместить вместо фотографии.
             * Используется, если у пользователя нет ссылки на аватар.
             *
             * @param {string} name
             * @return {string}
             */
            concatWatcherName(name) {
                return name.slice(0, 1);
            },

            /**
             * Вызов метода открытия модального окна для редактирования задачи.
             * Отправляет объект с типом модального окна и параметрами задачи.
             */
            updateTask() {
                const modalInfo = {
                    type: "update-task",
                    params: this.task
                }

                this.$store.dispatch("toggleModal", modalInfo);
            }
        }
    }
</script>
