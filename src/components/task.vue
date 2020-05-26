<template>
    <div class="task"
         @click="updateTask"
    >
        <div class="task__name">{{task.name}}</div>

        <div class="task__desc"
             v-if="task.desc"
        >{{task.desc}}</div>

        <ul v-if="task.list && task.list.length"
            class="task__list"
        >
            <li v-for="(listItem, index) in task.list"
                :key="index"
            >{{listItem}}</li>
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

        <div class="task__date">{{dateFormatting(task.date)}}</div>
    </div>
</template>

<script>
    import {convertDate} from "@/helpers/conver-date";

    export default {
        name: "task",
        props: ["task"],
        methods: {
            dateFormatting(date) {
                convertDate(date)
            },

            concatWatcherName(name) {
                return name.slice(0, 1);
            },

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
