<template>
    <transition name="vue-anim">
        <div class="modal" v-if="modal.visible">
            <div class="modal__background"
                 @click.prevent="closeModal"
            ></div>
            <div class="modal__wrapper">
                <div class="modal__container">
                    <div class="modal__header">
                        <div class="modal__close"
                             @click.prevent="closeModal"
                        ></div>
                    </div>
                    <create-user v-if="modal.type === 'user-add'"></create-user>
                    <modify-task v-if="modal.type === 'new-task' || modal.type === 'update-task'"
                                 :key="modal.type"
                    ></modify-task>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import createUser from "@/components/create-user"
    import modifyTask from "@/components/modify-task"

    export default {
        name: "modal",
        components: { createUser, modifyTask },
        computed: {
            modal() {
                return this.$store.getters.getModalData;
            }
        },
        methods: {
            closeModal() {
                this.$store.dispatch("toggleModal", "close")
            }
        }
    }
</script>
