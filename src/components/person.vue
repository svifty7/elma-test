<template>
    <div class="person">
        <div class="person__wrap">
            <div class="person__info">
                <div class="person__name">{{user.name}}</div>
                <div class="person__rm"
                     @click.prevent="removeUser"
                ></div>
            </div>
            <SlickList class="person__tasks"
                       :lockAxis="'xy'"
                       v-model="user.tasks"
                       :pressDelay="100"
                       @input="changeSortedTasks($event, user.id)"
            >
                <SlickItem v-for="(task, index) in user.tasks"
                           :index="index"
                           :key="index"
                >
                    <task :task="task"></task>
                </SlickItem>
            </SlickList>
            <div class="person__footer">
                <label class="person__footer--label">
                    <input
                            ref="taskName"
                            type="text"
                            class="person__footer--input"
                            placeholder="Название задачи"
                    >
                </label>
                <button class="person__footer--btn"
                        @click.prevent="newTask"
                >Добавить</button>
            </div>
        </div>
    </div>
</template>

<script>
    import task from "@/components/task";
    import {SlickList, SlickItem} from 'vue-slicksort';

    export default {
        name: "person",
        props: ["user"],
        components: {
            task,
            SlickList,
            SlickItem
        },
        methods: {

            /**
             * Вызов метода для обновления порядка задач у пользователя.
             * Отправляется объект с ID пользователя и готовым списком задач.
             *
             * @param event
             * @param {number} userId
             */
            changeSortedTasks(event, userId) {
                const updatedTasks = {
                    userId: userId,
                    sortedTasks: event
                };

                this.$store.dispatch("updateSortedTasks", updatedTasks)
            },

            /**
             * Вызов метода удаления пользователя.
             * Параметром отправляется ID удаляемого пользователя.
             */
            removeUser() {
                this.$store.dispatch("removeUser", this.user.id)
            },

            /**
             * Открытие модального окна для создания задачи.
             * Отправляет объект с типом модального окна и объект с параметрами: имя задачи и ID пользователя,
             * к которому необходимо прикрепить задачу.
             */
            newTask() {
                const modalInfo = {
                    type: "new-task",
                    params: {
                        name: this.$refs.taskName.value ? this.$refs.taskName.value : "",
                        user: this.user,
                    }
                }

                this.$store.dispatch("toggleModal", modalInfo);
                this.$refs.taskName.value = "";
            }
        }
    }
</script>
