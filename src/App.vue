
<template>
  <TabbedModal ref="modal" :needFooter="true" title="Настройки" v-if="showModal" @close="showModal = false">
    main content
    <!-- <template #sidebar>
        <span style="background-color: red;" @click="modal.goto('test', true)">test</span> 
        <span style="background-color: red;" @click="modal.goto('gogi', true)">gogi</span> 
        <span style="background-color: red;" @click="modal.goto('task', true)">smogi</span> 
    </template> -->
    <TabbedModalItem name="test" title="Основное">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus nulla at reprehenderit laudantium error ratione aperiam, impedit, enim praesentium molestias ipsum harum odio. Fugit qui aspernatur, dolore eius quod veniam, inventore porro dolorem earum laboriosam nostrum corporis quis nulla atque facere omnis, a possimus ea voluptatum mollitia consequuntur quam? Adipisci ullam quis sint nesciunt iste recusandae, rerum inventore maiores ad ut quod ea odio architecto hic ratione at exercitationem, quibusdam laboriosam error doloribus suscipit. Iusto unde asperiores omnis quod rem ea illo debitis qui incidunt, officia earum, perspiciatis illum hic optio natus ex. Deleniti modi sunt ad nam ratione aliquam provident mollitia iure, vero voluptatibus earum! Inventore, in eum quidem veniam quasi iure asperiores mollitia modi possimus soluta numquam, magni libero aperiam delectus corporis ex corrupti laudantium aspernatur. Consectetur esse quam fuga obcaecati laborum cum, adipisci molestias numquam dignissimos repudiandae laboriosam temporibus recusandae corrupti non facere nostrum, molestiae, odit amet ullam. Illo quaerat obcaecati molestias, magni praesentium enim aliquid molestiae tenetur odio a harum consequatur voluptatum libero natus incidunt nihil impedit, suscipit corrupti eum quod repellendus dolorem. Quo nesciunt quasi praesentium obcaecati veritatis assumenda id illo libero iure soluta facere, sequi magnam sunt eos deleniti optio placeat dignissimos, earum repudiandae adipisci. Officiis voluptas inventore odit dolorem placeat quas est veniam tenetur aspernatur. Aliquam adipisci consectetur accusamus architecto quasi? Repudiandae quam sed accusamus, assumenda, eius perspiciatis ullam expedita quaerat non quis aliquam, soluta nihil reprehenderit eligendi. Suscipit architecto eligendi, distinctio natus quasi ipsum porro quo iure accusantium quia? Saepe recusandae officia neque. Voluptatibus fugiat sed laboriosam saepe eaque modi accusantium ab quos fugit. Sed quam cumque, ea quas sapiente placeat in voluptates commodi excepturi exercitationem? Odit corrupti id eligendi deleniti mollitia itaque beatae fugiat corporis vitae sunt alias quibusdam minima ex consequatur blanditiis, fuga veritatis quae similique eum suscipit earum? Pariatur?
      <template #footer>
       ITEMFOOTER
      </template>
    </TabbedModalItem>
    <TabbedModalItem name="gogi">
      gogi
      <a href="#" @click="modal.goto('childGogi')">-> childGogi</a>

      <TabbedModalItem name="childGogi" @goback="console.log('ugdags')">
        I'M CHILD GOGI
        <a href="#" @click="modal.goto('childBABYGogi')">-> childBABYGogi</a>
        <a href="#" @click="modal.goto('childBABYGogi2')">-> childBABYGogi2132121</a>

        <TabbedModalItem name="childBABYGogi" ref="childBABYGogi" @goback="console.log('ifsaf')">
          I'M childBABYGogi
          <template #footer>
            <button @click="childBABYGogi.goBack()">save</button>
          </template>
        </TabbedModalItem>

        <TabbedModalItem name="childBABYGogi2">
          2222222222
          <template #footer>
            SDALDSALS LA SDDLSA
          </template>
        </TabbedModalItem>

      </TabbedModalItem>

    </TabbedModalItem>
    <TabbedModalItem name="task">
      TASK 123

      <template #footer>
       ITEMFOOTER
      </template>
    </TabbedModalItem>

    <template #mainFooter>
      MAIN FOOTER
    </template>
  </TabbedModal>
  <button class="show-modal" @click="showModal=true" v-if="!showModal">SHOW</button>
</template>

<script setup>
import TabbedModal from './components/TabbedModal.vue'
import TabbedModalItem from './components/TabbedModalItem.vue'

import { ref } from 'vue'

const modal = ref(null)
const showModal = ref(false)
const childBABYGogi = ref(null)

</script>

<style scoped>
</style>
