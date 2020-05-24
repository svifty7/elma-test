<template>
    <transition name="vue-anim">
        <div class="modal" v-if="modal.visible">
            <div class="modal__background"
                 @click.prevent="closeModal"
            ></div>
            <div class="modal__container">
                <div class="modal__header">
                    <div class="modal__close"
                         @click.prevent="closeModal"
                    ></div>
                </div>
                <create-user v-if="modal.type === 'user-add'"></create-user>
                <create-task v-if="modal.type === 'new-task' || modal.type === 'update-task'"
                             :data="modalData"
                ></create-task>
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
        computed: {
            modal() {
                return this.$store.getters.getModalData;
            },
            modalData() {
                return {
                    type: this.modal.type ? this.modal.type : undefined,
                    params: this.modal.params ? this.modal.params : {}
                }
            }
        },
        methods: {
            closeModal() {
                this.$store.dispatch("toggleModal", "close")
            }
        }
    }
</script>
