<template>
    <transition name="vue-anim">
        <div class="modal" v-show="show">
            <div class="modal__background"></div>
            <div class="modal__container">
                <div class="modal__header">
                    <div class="modal__close"></div>
                </div>
                <create-user v-show="false"></create-user>
                <create-task v-show="true"></create-task>
            </div>
        </div>
    </transition>
</template>

<script>
    import createUser from "@/components/create-user"
    import createTask from "@/components/create-task"

    export default {
        name: "modal",
        components: { createUser, createTask },
        data() {
            return {
                show: false
            }
        }
    }
</script>
