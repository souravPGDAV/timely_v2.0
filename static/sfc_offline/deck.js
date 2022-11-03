const deck={
    template:`<div>
                    



                    <div class="modal fade" id="addCard" tabindex="-1" aria-labelledby="CardModal" aria-hidden="true" >
                      <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h5 class="modal-title" >Add Card</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div class="modal-body" >
                              <div :class="this.alert_class" role="alert" v-if="this.errors.length>0">
                                <ul>
                                    <li v-for="item in this.errors">
                                        {{item}}
                                    </li>
                                </ul>
                            </div>
                            <form v-if="this.show_addCard==true">
                                <label>Card Front:</label>
                                <input type="text" name="Cfront" v-model="card_front" required/><br><br>
                                <label>Card Back:</label>
                                <input type="text" name="Cback" v-model="card_back" required/><br><br>
                                <label>Card Difficulty:</label>
                                <input type="text" name="CDiff" v-model="card_difficulty" required/><br><br>
                                
                            </form>
                          </div>
                          <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary"  v-on:click="add_card_api()" v-if="this.show_addCard==true">Add Card!</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="loaded==true">
                        <div class="alert alert-warning" role="alert" v-if="this.errors_main.length>0">
                            <ul>
                                <li v-for="item in this.errors_main">
                                    {{item}}
                                </li>
                            </ul>
                        </div>
                    
                        <div class="container-fluid row" align= "right">

                             <h1 class="display-6">USER :{{this.$store.getters.get_fname}} {{this.$store.getters.get_lname}}</h1>
                        </div>

                        <div align="center">
                            <div class="btn-group" role="group" aria-label="Basic outlined example" align="center">
                                <button type="button" class="btn btn-outline-primary"  v-on:click="go_to_dashboard()">Go to DashBoard</button>
                                <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#addCard" v-on:click="reset_card_modal()" >+Add Card</button>
                                <button class="btn btn-outline-primary"  v-on:click="revise_deck()" v-if="Object.keys(this.cards).length>0">Revise Deck</button>
                                
                                <button class="btn btn-outline-primary" v-on:click="export_clicked();" v-if="Object.keys(this.cards).length>0 && !this.csv_requested">Export to CSV</button>
                                <button class="btn btn-outline-primary" disabled v-if="Object.keys(this.cards).length>0 && this.csv_requested">CSV Requested</button>
                                <button class="btn btn-outline-primary" v-on:click="log_out()">Log Out</button>

        
                            </div>
                        </div>  
                        <div class="container p-5 my-5 border" align="center"><h3>DECK: {{this.deck_loop.deckTitle}}</h3></div>
                        
                        <div  align="center" class="row row-cols-2 row-cols-md-2 g-4">

                            <div v-for="c in this.cards">
                                <card_c :card_loop="c"></card_c>
                            </div>
                        </div>

                    </div>
                        <div v-if="loaded==false">
                            <div class="text-center">
                              <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                              </div>
                            </div>
                        </div>

                
            </div>`,
    props:['deckCode','deck_loop'],
    data:function() {
        return{
            show_card:"",
            // cards:null,
            card_back:"",
            card_front:"",
            card_difficulty:0,
            loaded:false,
            errors:[],
            cards:{},
            alert_class:"alert alert-danger",
            show_addCard:true,
            csv_requested:false,
            errors_main:[],
        }
    },
    computed:{
        got_card_details:function(){
            return this.$store.getters.get_card_details
        },
    },
    watch:{
        errors_main:function(val){
            // console.log("in watchers for errors_main=",this.errors_main)
            setTimeout(()=>this.errors_main=[],2000)
        }
    },
    mounted(){
        this.errors_main=[]
        this.$store.commit('reset_cards_for_revision')
        this.$store.commit('reset_decks_for_revision')
        this.$store.commit('empty_error')
        if(this.$store.getters.authentication_status==false){
            this.$store.commit('add_error', 'Need to login first')
            this.$router.push({ name: 'home' })

        }

        else{
            
            //var data_sent={'deckCode':this.deckCode}
            
            fetch("http://localhost:5000/api/cards/"+this.deckCode.toString(),{
                            headers:{'Content-Type':'application/json',                            
                            'Authentication-Token':this.$store.getters.get_a_token},method:'GET'
                            })
                        .then(resp=>{
                            if(!resp.ok){
                                console.log("not ok")
                                
                            }

                        return resp.json()})
                        .then(data=>{
                            if(data!=null && 'error' in data){
                                    this.$store.commit('empty_error')
                                    this.errors.push(data.error)
                                    //this.$router.push({ name: 'dashboard' })

                            }
                            this.$store.commit('reset_cards')
                            console.log(data)
                            this.$store.commit('reset_card_data')
                            
                            for (var i in data) {
                                if(i!='error'){
                                    
                                    this.cards[data[i].cardCode]=data[i]
                                }
                                
                                
                            }
                            
                            this.loaded=true
                            
                            
                        })      
        }
    },
    methods:{
        change_show_card:function(e){
            this.show_card=e
        },
        reset_card_modal:function(){
            this.errors=[]
            this.show_addCard=true
            this.card_front=""
            this.card_back=""
            
            this.card_difficulty=""
            this.alert_class="alert alert-danger"
        },
       
        difficulty_check:function(val){
            val=String(val)
            var digit=true
            console.log("difficulty=",val)
            if (val.length>1){
                return false
            }
            
                var char_code=val.charCodeAt(0)
                
                
                if(char_code<48 || char_code>57){
            
                    return false
                }
                if(val>3 || val<0){
                    return false
                }
           return digit

        },
        deleteCard:async function(e){
             var data_sent={'cardCode':e}
             fetch("http://localhost:5000/api/cards/"+this.cards[e].deckCode.toString(),{
                    headers:{'Content-Type':'application/json',                            
                    'Authentication-Token':this.$store.getters.get_a_token},method:"DELETE",
                    body:JSON.stringify(data_sent)})
                .then(resp=>{
                    if(!resp.ok){console.log("not ok");throw new Error();
                    }
                    else{return resp}
                })
                .then(data=>{     
                    delete this.cards[e];
                    dashboard.decks[this.cards[e].deckCode].count_cards-=1
                    this.$forceUpdate();
                
                })
                .catch(error=>{
                    this.errors.push('Could not delete card. Internal error')
                })
        },
        revise_deck:function(){
            this.$store.commit('add_deck_for_revision',this.deck_loop)
            this.$router.push({'name':'revise_component',params:{'helper':0}})
        },
        export_clicked:function(){
            this.csv_requested=true;
            console.log("in func export_clicked")
            console.log("this.csv_requested=",this.csv_requested)
            
            this.request_csv()
            //this.csv_requested=false;
            console.log("done")
        },
        go_to_dashboard:function(){
            this.$router.push({name:'dashboard'})
        },
        request_csv: async function(){
            this.csv_requested=true

            var data_sent={'requirement':'get_csv','deckCode':this.deckCode}
                fetch("http://localhost:5000/api/decks",{
                                headers:{'Content-Type':'application/json',        
                                'Authentication-Token':this.$store.getters.get_a_token},method:"PUT",
                                body:JSON.stringify(data_sent)})
                .then(resp=>{
                    if(!resp.ok){
                        console.log("not ok")
                        this.csv_requested=false
                        this.errors_main.push('Could not export.')
                    }
                    else{return resp.blob()}
                    
                })
                .then(file=>{
                    console.log(file)
                    if (file!=undefined){
                        const newBlob = new Blob([file], { type: 'text/csv'});
                        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                            window.navigator.msSaveOrOpenBlob(newBlob);
                        } else {
                            // For other browsers: create a link pointing to the ObjectURL containing the blob.
                            const objUrl = window.URL.createObjectURL(newBlob);

                            let link = document.createElement('a');
                            link.href = objUrl;
                            link.download = 'MyDeck'+this.deckCode+'.csv';
                            link.click();

                            // For Firefox it is necessary to delay revoking the ObjectURL.
                            setTimeout(() => { window.URL.revokeObjectURL(objUrl);this.csv_requested=false; }, 250);
                        }
                        //download(file)
                    }
                    })


        },
        log_out:function(){
            this.$parent.log_out()
        },

        resetCard:function(e,cd,cr,ccr,lr){
                this.cards[e].cardDifficulty=cd
                this.cards[e].count_revisions=cr
                this.cards[e].count_correct_revisions=ccr
                this.cards[e].last_revised=lr
                this.$forceUpdate()
            },
        cupdateDone:function(cCode,dCode,cFront,cBack,cDifficulty){
            this.cards[cCode].cardFront=cFront
            this.cards[cCode].cardBack=cBack
            this.cards[cCode].cardDifficulty=cDifficulty
            this.$forceUpdate()
        },
        add_card_api:function(){
            this.errors=[]
            // this.show_addDeck=true
            // if(this.difficulty<0 || this.difficulty>3){this.errors.push("Difficulty can be either of : 0,1,2,3")}
            if(!this.$parent.name_check(this.card_front)){this.errors.push('Card Front can not contain any special character')}
            if(!this.$parent.name_check(this.card_back)){this.errors.push('Card Back can not contain any special character')}
            
            if(!this.difficulty_check(this.card_difficulty)){this.errors.push('Card Difficulty can only be among- 0,1,2 or 3')}
            console.log("errors after all checks for card:",this.errors)
            if(this.errors.length>0){event.preventDefault()}
            if(this.errors.length==0){
                var data_sent={'cardFront':this.card_front,'cardBack':this.card_back,'cardDifficulty':this.card_difficulty}
                fetch("http://localhost:5000/api/cards/"+this.deckCode.toString(),{
                                headers:{'Content-Type':'application/json',                            
                                'Authentication-Token':this.$store.getters.get_a_token},method:"POST",
                                body:JSON.stringify(data_sent)})
                            .then(resp=>{
                                if(!resp.ok){console.log("not ok");this.errors.push('Could not add card. Internal error.')
                                }

                                else{return resp.json()}
                            })
                            .then(data=>{
                                this.alert_class="alert alert-success"
                                this.errors.push("DONE")
                                
                                console.log("received",data)
                                
                                for(var i in data){
                                    this.cards[i]=data[i]
                                }
                                
                                this.show_addCard=false
                                
                                // myModal.hide()
                                
                                    


                            }).catch(error=>{
                                // console.log("caught!")
                                this.errors=[]
                                this.alert_class='alert alert-danger'
                                this.errors.push('Could not add card. Internal error.')
                                console.log("caught!")
                                console.log(error)
                                
                             });
            }
        },

    },
        
    }


export default deck;