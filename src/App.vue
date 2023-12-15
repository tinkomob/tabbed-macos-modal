
<template>
    <TabbedModal 
      :open-first-section="true" 
      :sidebar-search="true"  
      :height="600" 
      :need-close-icon="true" 
      ref="modal" 
      :needFooter="true" 
      :simple="false" 
      :pan="false" 
      title="Настройки" 
      v-if="showModal" 
      @close="showModal = false"
    >
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus nulla at reprehenderit laudantium error ratione aperiam, impedit, enim praesentium molestias ipsum harum odio. Fugit qui aspernatur, dolore eius quod veniam, inventore porro dolorem earum laboriosam nostrum corporis quis nulla atque facere omnis, a possimus ea voluptatum mollitia consequuntur quam? Adipisci ullam quis sint nesciunt iste recusandae, rerum inventore maiores ad ut quod ea odio architecto hic ratione at exercitationem, quibusdam laboriosam error doloribus suscipit. Iusto unde asperiores omnis quod rem ea illo debitis qui incidunt, officia earum, perspiciatis illum hic optio natus ex. Deleniti modi sunt ad nam ratione aliquam provident mollitia iure, vero voluptatibus earum! Inventore, in eum quidem veniam quasi iure asperiores mollitia modi possimus soluta numquam, magni libero aperiam delectus corporis ex corrupti laudantium aspernatur. Consectetur esse quam fuga obcaecati laborum cum, adipisci molestias numquam dignissimos repudiandae laboriosam temporibus recusandae corrupti non facere nostrum, molestiae, odit amet ullam. Illo quaerat obcaecati molestias, magni praesentium enim aliquid molestiae tenetur odio a harum consequatur voluptatum libero natus incidunt nihil impedit, suscipit corrupti eum quod repellendus dolorem. Quo nesciunt quasi praesentium obcaecati veritatis assumenda id illo libero iure soluta facere, sequi magnam sunt eos deleniti optio placeat dignissimos, earum repudiandae adipisci. Officiis voluptas inventore odit dolorem placeat quas est veniam tenetur aspernatur. Aliquam adipisci consectetur accusamus architecto quasi? Repudiandae quam sed accusamus, assumenda, eius perspiciatis ullam expedita quaerat non quis aliquam, soluta nihil reprehenderit eligendi. Suscipit architecto eligendi, distinctio natus quasi ipsum porro quo iure accusantium quia? Saepe recusandae officia neque. Voluptatibus fugiat sed laboriosam saepe eaque modi accusantium ab quos fugit. Sed quam cumque, ea quas sapiente placeat in voluptates commodi excepturi exercitationem? Odit corrupti id eligendi deleniti mollitia itaque beatae fugiat corporis vitae sunt alias quibusdam minima ex consequatur blanditiis, fuga veritatis quae similique eum suscipit earum? Pariatur?
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

    <TabbedModalItem name="test3" title="Модификации">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae eum illum, aut ea cum, repellat nisi architecto iure esse corrupti voluptates aliquid suscipit? Aut rerum sint libero consequatur esse animi possimus odit facilis accusantium iusto. Rerum placeat quos dignissimos ipsam omnis, in repudiandae laborum labore sunt minima laboriosam itaque distinctio molestias ipsa non aut, molestiae perferendis nostrum fugit sequi! Cupiditate natus rem excepturi odio veritatis sequi voluptas. Voluptate quod dolorum quos aut laborum. Blanditiis rem soluta molestias possimus provident temporibus consectetur quas corporis inventore esse, iste ea consequuntur libero error ullam voluptates repudiandae! Iusto dignissimos, voluptas autem cum, vero nesciunt illum repellendus porro temporibus optio expedita quod eveniet amet at sapiente, reprehenderit officiis animi iure deserunt numquam? Est quaerat ad minus fugiat quia. Esse, sequi molestias? Blanditiis obcaecati alias ducimus, cumque, facilis itaque corrupti voluptatum accusamus nisi omnis sunt, ratione consequuntur. Suscipit provident laudantium nihil maiores ab earum officiis beatae similique! Dolore sunt blanditiis molestiae dicta quae quibusdam. Placeat, cupiditate corporis consequuntur eligendi molestias nisi? Commodi corrupti iure aut? Nobis tenetur molestias doloremque necessitatibus obcaecati, at minima culpa asperiores quisquam dignissimos, cupiditate quo nemo repudiandae voluptate consequatur accusamus ea veniam dolore magnam quos expedita ut quas repellat! Reprehenderit architecto quo quos eligendi repudiandae minima omnis provident molestias corporis nobis nam accusamus repellendus aspernatur hic rerum in saepe neque, illo assumenda soluta nesciunt suscipit temporibus exercitationem id? Quasi modi aut autem sit dolorem et laudantium incidunt neque maxime esse atque natus, voluptas voluptatem itaque tempora excepturi consequuntur magni nemo nihil fugit, reprehenderit sed temporibus! Harum ut, possimus similique ullam illum ab rerum dicta aliquam placeat. Officia sint ut, ipsum hic qui ipsam incidunt id adipisci tempore facere, voluptas atque, est possimus nisi. Est iure tempora impedit cumque temporibus nobis, laudantium asperiores saepe dolorum doloribus quam, amet fuga commodi necessitatibus autem perferendis maiores non? Aspernatur voluptate earum alias rem beatae. Tempore, quasi vitae praesentium labore nihil, quo illo esse modi porro natus quaerat consequatur optio iure enim veniam fuga laudantium quis. In, consequatur dignissimos sunt sint, nobis similique suscipit ut incidunt nam possimus quam non mollitia nulla dicta et esse minima blanditiis, eveniet quis labore atque itaque. Iure, id facilis eaque et mollitia, numquam deleniti dolores exercitationem quisquam, dignissimos officia accusamus hic laborum nam. Quasi sunt obcaecati corporis, enim aut facilis consectetur sed ipsa accusamus vel autem eius repellat error dicta possimus fugit ipsam nisi consequuntur. Iste praesentium et voluptatem amet itaque repudiandae aspernatur consectetur omnis, blanditiis soluta facere quia quibusdam voluptatibus dicta optio quisquam impedit sint veniam, eos atque incidunt temporibus cumque velit eaque. Veniam corporis consectetur ratione doloribus repellendus culpa enim maxime sint nemo architecto eligendi fugiat itaque voluptatibus laborum animi sapiente magnam, sunt deleniti illum provident accusamus tenetur quod officia numquam. Totam laboriosam et quasi consequuntur, tempora unde? Ratione libero in veniam iusto illum inventore at reprehenderit esse, quasi corporis repudiandae exercitationem quod neque tenetur sed alias magnam qui quae? Porro, voluptas, dolores quam eligendi officiis tempora quidem at, perspiciatis ipsum odio quis reiciendis amet corrupti quisquam! Officia, eos veniam labore sed obcaecati velit ullam itaque inventore fugiat ab consequatur dolorem rem consectetur architecto alias consequuntur neque laborum aspernatur quam iste adipisci nihil? Rem cumque id, ratione ex similique optio nostrum eius error facilis. Voluptatem eligendi ratione, ea dolorem, quibusdam obcaecati dolores amet nobis, sed nam nemo nesciunt quaerat quasi. Ea reprehenderit ipsam tempore a illo beatae corporis saepe, doloremque temporibus, in quasi, consectetur quam aliquam eum iure! Nemo animi aut delectus, recusandae quibusdam quia iure quos facilis libero distinctio eius beatae ipsa blanditiis odit voluptates ullam, pariatur temporibus ea tenetur officia corporis? Quia assumenda aliquid autem veritatis repellat vitae eius vel odit quis minus ab, obcaecati nesciunt facere, sequi dolor nam qui deleniti? Quo aspernatur nihil possimus ratione delectus dolor impedit natus modi ea nisi veniam nobis adipisci eaque suscipit repellendus consequatur, tenetur reprehenderit quidem, doloremque ipsam pariatur fugiat vero, vel obcaecati. Asperiores eligendi similique magnam blanditiis itaque aspernatur dignissimos repellendus sint. Neque tenetur dicta, ad autem expedita dolor repellendus earum facere, necessitatibus alias sint rem voluptatum deleniti tempora unde odit tempore. Ducimus, nisi odit. Ex eum voluptate et unde error soluta asperiores itaque nobis illum magni, quibusdam nemo eius officia, quisquam sint mollitia obcaecati numquam vel fugiat nostrum corrupti esse natus dolorem. Repudiandae impedit, omnis ea, aliquid atque quia nisi optio, nesciunt quidem possimus odio maxime magnam sit blanditiis? Minima, consequuntur nobis similique doloremque ea enim labore placeat? Pariatur quidem deleniti dicta. Porro aliquid possimus est pariatur iure minus facere. Doloremque consequatur error magnam nobis itaque, expedita impedit libero et id odit officiis, facilis labore sint blanditiis consequuntur necessitatibus assumenda tempora. Corporis eos sunt aliquid similique saepe, dicta a sit beatae, suscipit excepturi ipsa, illo fugiat nostrum. Eum neque obcaecati dolorem odit non deleniti inventore provident ea a, magnam qui quas nihil sed, voluptas veniam magni rerum voluptates nam sequi doloremque ullam beatae architecto dignissimos aspernatur! Distinctio nostrum porro quia nulla tenetur quas itaque delectus vel architecto! Debitis hic quod ipsum quae beatae deserunt veniam autem? Labore totam odio incidunt distinctio reiciendis ea pariatur maxime neque, sit quos aliquam architecto dolore, deleniti sapiente soluta libero temporibus aliquid eaque earum aut odit corporis molestiae? Facere quidem adipisci minima voluptate laudantium commodi asperiores sit accusantium ipsa sapiente necessitatibus provident amet sint, quam voluptatum qui fuga labore molestiae? Natus illo veniam libero molestias molestiae perferendis architecto quas ipsam voluptas suscipit, quis voluptatibus, ipsa quos impedit quidem at, dolore esse maiores! Maiores repellendus deserunt recusandae fuga mollitia eveniet libero itaque accusantium cupiditate iure debitis harum facere ipsum quis, hic, dolor dolorem architecto, iusto provident perspiciatis laboriosam. Quae corrupti, vero voluptatum molestias magnam quisquam exercitationem quam maxime nam laudantium autem mollitia cum atque perferendis quod laboriosam unde, minima nostrum voluptatibus laborum. Magnam quia dolores ipsa alias eveniet facere, quos asperiores fuga adipisci sint sit molestiae, perferendis, sapiente excepturi. Unde architecto molestias fugiat earum officiis fugit at ex minima neque quod incidunt eligendi, facilis adipisci nesciunt reiciendis dicta sunt explicabo recusandae laboriosam tenetur praesentium magnam aliquam perspiciatis aliquid! Quia adipisci eaque esse obcaecati!532325
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
    <TabbedModalItem name="sostav" title="Состав">
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel praesentium ea eius quo molestiae corporis quidem dicta id atque. Ea quia at illo, doloremque sit consectetur quasi tempore a porro.
      <template #footer>
       SOSTAV FOOTER
      </template>
    </TabbedModalItem>
    <TabbedModalItem name="task">
      TASK 123

      <template #footer>
       ITEMFOOTER
      </template>
    </TabbedModalItem>

    <TabbedModalItem name="task1" title="Товары">
      TASK 123

      <template #footer>
       ITEMFOOTER
      </template>
    </TabbedModalItem>
    <TabbedModalItem name="task2">
      TASK 123

      <template #footer>
       ITEMFOOTER
      </template>
    </TabbedModalItem>
    <TabbedModalItem name="task3">
      TASK 123

      <template #footer>
       ITEMFOOTER
      </template>
    </TabbedModalItem>
    <TabbedModalItem name="task4">
      TASK 123

      <template #footer>
       ITEMFOOTER
      </template>
    </TabbedModalItem>
    <TabbedModalItem name="task5">
      TASK 123

      <template #footer>
       ITEMFOOTER
      </template>
    </TabbedModalItem>
    <TabbedModalItem name="task6">
      TASK 123

      <template #footer>
       ITEMFOOTER
      </template>
    </TabbedModalItem>
    <TabbedModalItem name="task7">
      TASK 123

      <template #footer>
       ITEMFOOTER
      </template>
    </TabbedModalItem>
      <TabbedModalItem name="task8">
      TASK 123

      <template #footer>
       ITEMFOOTER
      </template>
    </TabbedModalItem>
    <TabbedModalItem name="task9">
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
