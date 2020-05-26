<template>
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
                <modify-task v-if="modalTypeIsTask"
                             :key="modal.type"
                ></modify-task>
            </div>
        </div>
    </div>
</template>

<script>
    import createUser from "@/components/create-user"
    import modifyTask from "@/components/modify-task"

    export default {
        name: "modal",
        components: {createUser, modifyTask},
        computed: {

            /**
             * Вызов метода для получения состояния модального окна.
             *
             * @return {any}
             */
            modal() {
                return this.$store.getters.getModalData;
            },

            /**
             * Условие для отображения модального окна создания/редактирования задачи.
             *
             * @return {boolean}
             */
            modalTypeIsTask() {
                return this.modal.type === 'new-task' || this.modal.type === 'update-task'
            }
        },
        methods: {

            /**
             * Вызов метода закрытия модального окна.
             * Параметром закрытия является строка "close".
             */
            closeModal() {
                this.$store.dispatch("toggleModal", "close")
            }
        }
    }
</script>
