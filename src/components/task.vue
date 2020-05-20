<template>
    <div class="task">
        <div class="task__name">{{task.name}}</div>

        <div class="task__desc"
             v-if="task.desc"
        >{{task.desc}}</div>

        <ul v-if="task.list && task.list.length"
            class="task__list"
        >
            <li v-for="(listItem, index) in task.list"
                :key="index"
            >{{listItem.text}}</li>
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
            convertDate(date) {
                date = new Date(date);

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
            concatWatcherName(name) {
                return name.slice(0, 1);
            }
        }
    }
</script>
