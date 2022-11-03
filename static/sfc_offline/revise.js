

const revise={
    template:`
        <div>
            <h2 align="center">Revision</h2>
                <div class="modal fade" id="for_cards_order" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
          
                  <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" >Revise Cards</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" v-on:click="modal_closed()"></button>
                      </div>
                    
                      <div class="modal-body">
                                <div v-if="new_deck==true" align="center">REVISION for DECK- <div class="alert alert-primary" role="alert"> {{this.$store.getters.get_decks_for_revision[0].deckTitle}}</div></div>
                                <div class="mb-3">
                                    <label><h4 align="center">Which order do you wish to revise the cards for this deck?</h4></label><br>
                                    <input type="radio" id="method" name="method" value="random" required v-model="order"> I wish to revise randomly chosen cards</input><br>
                                    <input type="radio" id="method" name="method" value="serial" v-model="order"> I wish to revise least revised cards first</input><br>
                                    <input type="radio" id="method" name="method" value="serial_d" v-model="order"> I wish to revise most revised cards first</input><br>
                                    <input type="radio" id="method" name="method" value="l_d" v-model="order"> I wish to revise most difficult ones first</input><br>
                                    <input type="radio" id="method" name="method" value="d_l" v-model="order"> I wish to revise most easy ones first</input><br>
                                </div>
                                <div class="mb-3">
                                    <label><h4 align="center">What way do you wish to answer?</h4></label><br>
                                    <input type="radio" id="c_o" name="c_o" value="mcq" selected v-model="options_like"/> MCQs
                                    <input type="radio" id="c_o" name="c_o" value="inp" v-model="options_like"/> Custom Input<br>
                                    <input type="checkbox" name="back" id="back" value="true" v-model="back_part_as_que"/> I would answer the front part
                                </div>
                            
                      </div>
                      <div class="modal-footer" v-if="this.order.length>0">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" v-on:click="modal_closed()">Close</button>
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" v-on:click="asked_for_revision()" >Let's GO</button>
                      </div>
                      
                    </div>
                  </div>
                </div>
                <div align="center">
                <div class="btn-group" role="group" aria-label="Basic outlined example" align="center">
                    <button type="button" class="btn btn-outline-primary"  v-on:click="go_to_dashboard_func()">Go to DashBoard</button>       
                    <!--button class="btn btn-outline-primary" v-on:click="log_out();">Log Out</button-->
                </div>
                </div>
               
                <div v-if="showCard==true" class="mb-3" align="center">
                    <div v-if="back_part_as_que" align="center">
                        <h2>{{this.current_card.cardBack}}</h2>
                        <h3>What is at the front?</h3>
                    </div>
                    <div v-else="back_part_as_que" align="center">
                        <h2>{{this.current_card.cardFront}}</h2>
                        <h3>What is at the back?</h3>
                    </div>
                    
                    
                    
                    


                    <div v-if="answer.length>0" :class="response_class" role="alert"><h4>{{response}}</h4></div>
                    <input type="text" v-model="answer" :disabled="done==true" v-if="this.options_like=='inp'">
                    <div v-for="ans in this.current_card.options">
                        <input type="radio" v-model="answer" :value="ans" :disabled="done==true">{{ans}}</input>
                    </div>
                    <button tpye="button" class="btn btn-primary" v-on:click="i_quit()" v-if="response=='WRONG' && this.options_like=='inp'">I Quit :( </button>
                    <div v-if ="done==true">
                        <h3 v-if ="response=='RIGHT'"> Great! How was it?</h3>
                        <h3 v-if ="response=='WRONG'"> Was it much difficult?</h3>

                        <input type="radio" id="c_o" name="c_o" value="1" selected v-model="difficulty"/> Easy
                        <input type="radio" id="c_o" name="c_o" value="2" v-model="difficulty"/> Medium 
                        <input type="radio" name="c_o" id="c_o" value="3" v-model="difficulty"/> Difficult
                        <div v-if="this.difficulty.length>0">
                            <button type="button" class="btn btn-primary" v-if="this.$store.getters.get_cards_for_revision.length>1" v-on:click="revisionDone()">Next--</button>
                            <button type="button" class="btn btn-primary" v-else="this.$store.getters.get_cards_for_revision.length>1" v-on:click="revisionDone()" >Finish.</button>
                        </div >
                    </div >
                </div>





        </div>
    `,
    props:['helper'],
    data:function(){
        return{
            order:"",
            difficulty:"",
            new_deck:false,
            showCard:false,
            time_revised:null,
            errors:"",
            
            options_like:"inp",
            back_part_as_que:false, 
            currernt_card:null,
            current_deck:null,
            answer:"",
            done:false,
            response:"WRONG",
            response_class:"alert alert-danger",
            has_quit:false,
            options:[],
            go_to_dashboard:false,
        }
        
    },
    watch:{
        answer:function(val){
            var revised_time=new Date()
                
                
                
                let current_mins=revised_time.getMinutes()
                let current_hrs=revised_time.getHours()
                
                
                if(30-current_mins>0){
                    revised_time.setMinutes(current_mins+30)
                    revised_time.setHours(current_hrs+5)
                }
                else{
                    revised_time.setHours(current_hrs+6);
                    revised_time.setMinutes(current_mins-30)
                }
                
                

            if(this.back_part_as_que==true){
                
                if(this.answer==this.current_card.cardFront ){
                    if(this.has_quit==false){this.response="RIGHT";this.done=true;this.response_class="alert alert-success";this.time_revised=(revised_time).toJSON();}
                    else{this.response="ANSWER:";this.done=true;this.response_class="alert alert-warning";this.time_revised=(revised_time).toJSON();}
                    }
                    
                else{

                    if(this.options_like=='mcq'){this.response="WRONG";this.response_class="alert alert-danger";this.done=true;this.time_revised=(revised_time).toJSON();}
                    else{this.response="WRONG";this.response_class="alert alert-danger";}
                }
            }
            else {if(this.answer==this.current_card.cardBack){

                if(this.has_quit==false){this.response="RIGHT";this.done=true;this.response_class="alert alert-success";this.time_revised=(revised_time).toJSON();}
                else{this.response="ANSWER:";this.done=true;this.response_class="alert alert-warning";this.time_revised=(revised_time).toJSON();}   }
                
                else{
                if(this.options_like=='mcq'){this.response="WRONG";this.response_class="alert alert-danger";this.done=true;this.time_revised=(revised_time).toJSON();}
                 else{this.response="WRONG";this.response_class="alert alert-danger";}
                }
            }
        },

        
    },
    mounted(){
       this.go_to_dashboard=false
        // console.log("after mounted, deck=",this.$store.getters.get_decks_for_revision)
        // console.log("after mounted, cards=",this.$store.getters.get_cards_for_revision)
        if(this.$store.getters.get_decks_for_revision.length==0){
            this.$store.commit('add_error','Opt for revision through the provided buttons')
            this.$router.push({name:'dashboard'})
        }
        if(this.$store.getters.get_cards_for_revision.length==0){
            this.new_deck=true
            var myModal = new bootstrap.Modal(document.getElementById('for_cards_order'))
            myModal.toggle()
        }
        else{
            this.intialization()
        }
        
    },
    beforeRouteLeave (to, from, next) {
        if(this.go_to_dashboard==false){
            if(confirm('You have not revised fully. Ready to exit?')==true){
                next(false)
                this.go_to_dashboard=true
                this.$router.push({name:'dashboard'})
            
            }
            else{
                next(false);
            }
        }
        else{next()}

    },
    methods:{
        asked_for_revision:function(){
            this.$store.commit('set_options_preference',this.options_like)
            this.$store.commit('set_back_part_as_que_preference',this.back_part_as_que)
            var data_sent={'requirement':'get','order':this.order,'deckCode':this.$store.getters.get_decks_for_revision[0].deckCode,'options_required':this.options_like=='mcq','send_front':this.back_part_as_que }
                     fetch("http://localhost:5000/api/cards/"+this.$store.getters.get_decks_for_revision[0].deckCode.toString(),{
                            headers:{'Content-Type':'application/json',                            
                            'Authentication-Token':this.$store.getters.get_a_token},method:"PUT",
                            body:JSON.stringify(data_sent)})
                        .then(resp=>{
                            if(!resp.ok){console.log("not ok");this.$store.commit('add_error','Could not revise. Internal Server Error');    this.go_to_dashboard=true;this.$router.push({'name':'dashboard'}) 
                            }

                        return resp.json()})
                        .then(data=>{
                            if('error' in data){this.$store.commit('add_error',data['error']);    this.go_to_dashboard=true;this.$router.push({'name':'dashboard'})  }
                            for(var i in data){this.$store.commit('add_card_for_revision',data[i])}
                            // console.log('cards received=',data)
                            this.intialization()
                            
                    })       
        },
        log_out:function(){
            this.$parent.log_out()
        },
        modal_closed:function(){
            this.go_to_dashboard=true
            this.$router.push({name:'dashboard'})
        },
        go_to_dashboard_func:function(){
            this.$router.push({name:'dashboard'})
        },
        intialization:function(){
            if(this.$store.getters.get_cards_for_revision.length==0){
                if(this.$store.getters.get_decks_for_revision.length>1){
                    this.$store.commit('deck_revised')
                    if(this.helper=='0'){this.$router.push({'name':'revise_component',params:{'helper':'moni'}})}
                    else{this.$router.push({'name':'revise_component',params:{'helper':'0'}})}
                }
                else{
                    this.$router.push({'name':'dashboard'})   
                }
            }
            this.current_deck=this.$store.getters.get_decks_for_revision[0]
            this.current_card=this.$store.getters.get_cards_for_revision[0]
            this.options_like=this.$store.getters.get_options_preference
            this.back_part_as_que=this.$store.getters.get_back_part_as_que_preference

            // if(this.options_like=='mcq'){
            //     if(this.front_part_as_que==true){var url=`https://www.stands4.com/services/v2/syno.php?uid=10089&tokenid=boBrwjQgeCmk2MuF&word=another&format=json`}
            //     else{var url=`https://www.stands4.com/services/v2/syno.php?uid=10089&tokenid=boBrwjQgeCmk2MuF&word=else&format=json`}
            //     fetch(url,{headers:{'Content-Type':'application/json',"Access-Control-Allow-Origin":'*'},method:"GET"})
            //     .then(resp=>{
            //         if(!resp.ok){console.log("could not fetch words from api")}
            //         return resp.json()
            //     })
            //     .then(data=>{
            //         console.log(data)
            //         for(i in data.results.result.synonyms){
            //             this.options.push(i)
            //             if(this.options.length==4){
            //                 break
            //             }
            //         }
            //     })
            // }
            this.start_revision()
        },
        i_quit:function(){
            // console.log("in func")
            this.has_quit=true
            this.done=true
            // console.log("has_quit now=",this.has_quit)
             if(this.back_part_as_que==true){
                this.answer=this.current_card.cardFront
                // console.log("here")
            }   
            else{
                this.answer=this.current_card.cardBack
                // console.log("there")
            }
        },
        start_revision:function(){
            // console.log('in start revision cards=',this.$store.getters.get_cards_for_revision)
            // console.log('in start revision decks=',this.$store.getters.get_decks_for_revision)

            if(this.$store.getters.get_cards_for_revision.length==0){

                if(this.$store.getters.get_decks_for_revision.length==0){}}
                // this.$store.commit('add_error','Could not fetch you cards for revision.');this.$router.push({name:'dashboard'})}
            // else{
            //     if(this.$store.getters.get_cards_for_revision.length==1){this.$store.commit('deck_revised')}

                this.showCard=true

            // }
        },
        revisionDone:function(){

                var data_sent={'requirement':'revise','cardCode':this.current_card.cardCode,'correct':this.response=="RIGHT",
                        'time':this.time_revised,'deck_full_revised':this.$store.getters.get_cards_for_revision.length==1,'difficulty':this.difficulty }
                        // console.log("Sent this data for revising=",data_sent)
                     fetch("http://localhost:5000/api/cards/"+this.current_card.deckCode,{
                            headers:{'Content-Type':'application/json',                            
                            'Authentication-Token':this.$store.getters.get_a_token},method:"PUT",
                            body:JSON.stringify(data_sent)})
                        .then(resp=>{
                            if(!resp.ok){console.log("not ok");this.$parent.errors_main.push("Could not set up revision. Internal error");
                            this.go_to_dashboard=true
                                    this.$router.push({'name':'dashboard'})
                                    this.$store.commit('reset_options_preference')
                            }

                        return resp.json()})
                        .then(data=>{
                            this.$store.commit('card_revised')
                            if(this.$store.getters.get_cards_for_revision.length>0){
                                // if(this.helper==0){this.$router.push({'name':'revise_component',params:{'helper':1}})}
                                // else{this.$router.push({'name':'revise_component',params:{'helper':0}})}

                                if(this.helper=='0'){this.$router.push({'name':'revise_component',params:{'helper':'moni'}})}
                                else{this.$router.push({'name':'revise_component',params:{'helper':'0'}})}
                            }
                            else{
                                this.$store.commit('deck_revised')
                                if(this.$store.getters.get_decks_for_revision.length>0){
                                    if(this.helper=='0'){this.$router.push({'name':'revise_component',params:{'helper':'moni'}})}
                                    else{this.$router.push({'name':'revise_component',params:{'helper':'0'}})}
                                }
                                else{
                                    this.go_to_dashboard=true
                                    this.$router.push({'name':'dashboard'})
                                    this.$store.commit('reset_options_preference')
                                }
                                // alert(this.$router.params['key'])
                                
                                // this.$router.push({name:'dashboard'})
                            }
                        })
        },
    },
}

export default revise;