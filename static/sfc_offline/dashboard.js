const dashboard={
    template:`
       <div>
            <h4 align="right">USER: {{current_user.fname}} {{current_user.lname}}{{check}}</h4>

            <div align="center">
            <div class="btn-group" role="group" aria-label="Basic outlined example" align="center" >
                <button type="button" class="btn btn-outline-primary" id="scheduleClass" v-on:click="schedule_class()">+Schedule</button>
                <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#deleteUser">Delete Account</button>
                <button class="btn btn-outline-primary" v-on:click="log_out();">Log Out</button>
            </div>
            </div>
            <hr>
            <h5 align="center">Today's Classes:</h5>
            <div  align="center" class="row row-cols-2 row-cols-md-2 g-4">
            
            <div  v-for="x in classes">
                                <class_card :class_details="x"></class_card>
            </div>
            </div>
            
        </div>
        `,
        data:function(){
                return{
                    check:null,
                    current_user:null,
                    classes:{},
                    errors_main:[],
                    errors_modal:[],
                }
            },
    computed:{
        fname:function(){
            return this.$store.getters.get_current_user
        },
        lname:function(){
            return this.$store.getters.get_current_user
        },
    },
   
   
    async mounted(){
        
        
        if(this.$store.getters.authentication_status==false){
        // if(false){
            this.$store.commit('empty_error')
            this.$store.commit('add_error', 'Need to login first')
            this.$router.push({ name: 'home' })

        }
        else{
            
            this.current_user=this.$store.getters.get_current_user
            //fetch the scheduled classes

            fetch("http://localhost:5000/api/t/classes",{
                            headers:{'Content-Type':'application/json',                            
                            'Authentication-Token':this.$store.getters.get_a_token},method:"GET"})
                        .then(resp=>{
                            if(!resp.ok){console.log("not ok");this.errors.push('Could not fetch decks. Contact Sourav');return false;
                            }

                            else{return resp.json()}

                        })
                        .then(data=>{
                            for (var i in data) {
                                // this.check=''//for getting others updated
                                this.classes[data[i].class_id]=data[i]
                            }
                            
                            this.$forceUpdate();
                        })

            
        }
    },
    watch:{
        errors_main:function(val){
            setTimeout(()=>this.errors_main=[],4000)
      },
    },
    methods:{
        log_out:function(){
            this.$parent.log_out()
        },
        empty_errors_modal:function(){
            this.errors_modal=[]
        },
        // delete_user_confirmed: function(){

        //              fetch("http://localhost:5000/api/user",{
        //                     headers:{'Content-Type':'application/json',                            
        //                     'Authentication-Token':this.$store.getters.get_a_token},method:"DELETE"})
        //                 .then(resp=>{
        //                     if(!resp.ok){console.log("not ok");throw new Error();
        //                     }
        //                 else{return resp}
        //                 })
        //                 .then(data=>{     
        //                     this.$store.commit('add_error','Account deleted successfully')
        //                     this.$router.push({'name':'home'})
        //                 })
        //                 .catch(error=>{this.errors_main.push('Could not delete your account. Contact Sourav')})
        // },
        // asked_for_revision:async function(){
        //      var data_sent={'requirement':'get','order':this.order }
        //              fetch("http://localhost:5000/api/decks",{
        //                     headers:{'Content-Type':'application/json',                            
        //                     'Authentication-Token':this.$store.getters.get_a_token},method:"PUT",
        //                     body:JSON.stringify(data_sent)})
        //                 .then(resp=>{
        //                     if(!resp.ok){console.log("not ok");console.log(resp.json());throw new Error();
        //                     }

        //                     else{return resp.json()}
        //                 })
        //                 .then(data=>{
        //                     for(var i in data){this.$store.commit('add_deck_for_revision',data[i])}
        //                     this.$router.push({'name':'revise_component',params:{'helper':0}})
        //                     // console.log(data)
        //             }).catch(error=>{this.errors_main.push('Could not fetch you decks for revision.')})
                                
        // },
        // after_importing:async function(e){
        //     this.csv_imported=true
        //     this.errors_main=[]
        //     this.errors_modal=[]
        //     var file=document.getElementById('fileInput').files[0]
        //     var data=new FormData()
        //     data.append('file',file)
        //     data.append('requirement','import_csv')
        //     //console.log("sending this data=",data)
        //     fetch("http://localhost:5000/api/decks",{

        //         headers:{'Authentication-Token':this.$store.getters.get_a_token},method:"PUT",
        //         body:data})
        //     .then(resp=>{
        //         // console.log(document.getElementById('fileInput').files," and value=",document.getElementById('fileInput').value)
        //         document.getElementById('fileInput').value=""
        //         if(!resp.ok){
        //             console.log("not ok=",resp)
        //                 this.errors_modal.push('Could not import Deck.')
        //                 this.csv_imported=false
        //                 // throw new Error();
        //         }
        //        return resp.json()
        //     })
        //     .then(resp=>{
        //         // console.log('resp in then=',resp)
        //         if(this.errors_modal.length>0){
        //             this.errors_modal.push(resp.error)
        //             var myModal = new bootstrap.Modal(document.getElementById('specialError'))
        //             myModal.toggle()
        //         }
        //         else{
        //             this.errors_main.push("DONE import")
        //             for(var i in resp){
        //                this.decks[i]=resp[i]
        //             }
                        
        //         }
                
        //         this.csv_imported=false
                
        //     }).catch(error=>{
        //         this.errors_modal.push('Internal Error')
        //         var myModal = new bootstrap.Modal(document.getElementById('specialError'))
        //         myModal.toggle()
        //     })

        // },
        // import_file:function(){
        //     document.getElementById('fileInput').click()
        //     // console.log('here',document.getElementById('fileInput').files)
            
        // },
        // deleteDeck: async function(e){
        //             var data_sent={'deckCode':e}

        //              fetch("http://localhost:5000/api/decks",{
        //                     headers:{'Content-Type':'application/json',                            
        //                     'Authentication-Token':this.$store.getters.get_a_token},method:"DELETE",
        //                     body:JSON.stringify(data_sent)})
        //                 .then(resp=>{
        //                     if(!resp.ok){console.log("not ok");throw new Error();
        //                     }
        //                 else{return resp}
        //                 })
        //                 .then(data=>{     
        //                     // console.log("here in deletion after update,", data)
        //                     delete this.decks[e];
        //                     this.$forceUpdate();
        //                     // console.log("here in deletion after update")
                            
        //                 })
        //                 .catch(error=>{
        //                     this.errors.push('Could not delete deck. Internal error')
        //                 })
        //         },
        // reset_deck_modal:function(){
        //     this.errors=[]
        //     this.show_addDeck=true
        //     this.deck_title=""
        //     this.deck_lang=""
        //     this.alert_class="alert alert-danger"
        // },
        // updateDone:function(dCode,dTitle,dLang){
        //     this.decks[dCode].deckTitle=dTitle
        //     this.decks[dCode].deckLanguage=dLang
        //     this.$forceUpdate()
        // },
        // show_form_m:function(){
        //     this.errors=[]
        //     this.c_pwd=""
        //     this.new_pwd=""
        //     this.confirm_pwd=""
        //     this.show_update_user=true
        //     this.fname=this.$store.getters.get_fname
        //     this.lname=this.$store.getters.get_lname
        //     this.show_pwd_fields=0
        //     this.alert_class="alert alert-danger"
        // },
        // show_pwd_fields_func:function(e){
        //     this.show_pwd_fields=e
        // },
        // deletion_called:function(){
        //     // console.log("in de")
        //     this.choose=3-this.choose

        // },
        // add_deck_api:function(){
        //     this.errors=[]
        //     // this.show_addDeck=true
        //     // if(this.difficulty<0 || this.difficulty>3){this.errors.push("Difficulty can be either of : 0,1,2,3")}
        //     if(!this.$parent.name_check(this.deck_title)){this.errors.push('Deck Name can not contain any special character')}
        //     if(!this.$parent.name_check(this.deck_lang)){this.errors.push('Deck Language can not contain any special character')}
        //     if(this.errors.length>0){event.preventDefault()}
        //     if(this.errors.length==0){
        //         var data_sent={'requirement':'add','deckLanguage':this.deck_lang,'deckTitle':this.deck_title}
        //         fetch("http://localhost:5000/api/decks",{
        //                         headers:{'Content-Type':'application/json',                            
        //                         'Authentication-Token':this.$store.getters.get_a_token},method:"POST",
        //                         body:JSON.stringify(data_sent)})
        //                     .then(resp=>{
        //                         if(!resp.ok){console.log("not ok");throw new Error();
        //                         }

        //                         else{return resp.json()}
        //                     })
        //                     .then(data=>{
        //                         this.alert_class="alert alert-success"
        //                         this.errors.push("DONE")
                                
        //                         // console.log("received",data)
        //                         for(var i in data){
        //                            this.decks[i]=data[i]
        //                         }
        //                         this.show_addDeck=false
                                
        //                         // myModal.hide()
                                 
                                    


        //                     }).catch(error=>{
        //                         // console.log("caught!")
        //                         this.errors.push('Could not fetch you decks for revision.Internal error')
        //                         // console.log("caught!")
        //                         // console.log(error)
        //                         event.preventDefault()
        //                      });
        //     }
        // },
        // user_update_api:function(){

        //         this.errors=[]
        //         if(this.show_pwd_fields==1){this.errors=this.$parent.password_check(this.new_pwd)}
        //             if(this.errors.length==0 && this.show_pwd_fields==1){this.errors=this.$parent.password_check(this.c_pwd)}
        //         if(this.new_pwd!=this.confirm_pwd && this.show_pwd_fields==1){this.errors.push('Confirmed password does not match')}
        //        if(this.fname.length==0){this.errors.push('First Name is required')}
        //        if(!this.$parent.name_check(this.fname)){this.errors.push('First name can not contain any special character')}
        //         if(!this.$parent.name_check(this.lname)){this.errors.push('Last name can not contain any special character')}
        //        if(this.errors.length>0){return false}
        //        var call_below=true
           
                                
        //         var data_sent={'fname':this.fname,'lname':this.lname,'dont_send_daily_reminders':this.dont_send_daily_reminders,'dont_send_monthly_report':this.dont_send_monthly_report}
        //         if(this.show_pwd_fields==1){
        //                         call_below=false
        //                         const data_sent = new URLSearchParams()

        //                         data_sent.append('password',this.c_pwd)
        //                         data_sent.append('new_password',this.new_pwd)
        //                         data_sent.append('new_password_confirm',this.confirm_pwd)
                                
                                
        //                          var p1=fetch("http://localhost:5000/change",{ method:'POST',
        //                              body: data_sent })
        //                          .then(resp=>{
        //                             if(!resp.ok){
        //                                 throw new Error();
        //                             }
        //                             else{return resp.text()}
        //                         })
        //                          .then(data=>{
        //                             var parser = new DOMParser();

        //                             var doc = parser.parseFromString(data, "text/html");
        //                             // console.log(doc)
        //                             var returns=doc.querySelector('li')
        //                             // console.log("returns aauya=",returns)
        //                             if(returns!=null && returns[0]!='Y'){
        //                                 this.errors.push(returns.innerHTML)
                                        
        //                             }
        //                             else{
        //                                 // console.log("callbelow ho gaya trye")
        //                                 this.errors.push("DONE")
        //                                 this.show_update_user=false
        //                                 this.alert_class="alert alert-success"
        //                                 const elements = document.getElementsByClassName('modal-backdrop');

        //                                 while(elements.length > 0){
        //                                     elements[0].parentNode.removeChild(elements[0]);
        //                                 }
        //                                 this.$router.push({name:'home'})

        //                             }
                                    
                                    
        //                         })//.catch(error=>{this.errors.push("Could not update. Try Contacting 21F1000075@student.onlinedegree.iitm.ac.in")})
        //         }

        //         // console.log("now before call_below, p1=",p1.state)
        //         else{
        //             // console.log("here sending=",data_sent)
        //             fetch("http://localhost:5000/api/user",{
        //                         headers:{'Content-Type':'application/json',                            
        //                         'Authentication-Token':this.$store.getters.get_a_token},method:"PUT",
        //                             body:JSON.stringify(data_sent)})
        //                     .then(resp=>{
        //                         if(!resp.ok){throw new Error();
        //                         }

        //                         else{return resp.json()}
        //                     })
        //                     .then(data=>{
        //                         //changing password now
                                
        //                         this.$store.commit('set_fname',this.fname)
        //                         this.$store.commit('set_lname',this.lname)
        //                         if(this.errors.length==0){this.errors.push("DONE")
        //                             this.show_update_user=false
        //                             this.alert_class="alert alert-success"

        //                         }
        //                      }).catch(error=>{console.log("not ok",resp);this.errors.push('Could not update. Try Contacting 21F1000075@student.onlinedegree.iitm.ac.in')})
        //         }
        //        },
               

            
        
        // refresh:function(){
        //      data_sent={'requirement':'get'}
        //     fetch("http://localhost:5000/api/decks",{
        //                     headers:{'Content-Type':'application/json',                            
        //                     'Authentication-Token':this.$store.getters.get_a_token},method:"POST",
        //                     body:JSON.stringify(data_sent)})
        //                 .then(resp=>{
        //                     if(!resp.ok){console.log("not ok")
        //                     }

        //                 return resp.json()})
        //                 .then(data=>{
        //                     this.$store.commit('reset_decks')
                            
        //                     this.$store.commit('reset_deck_data')
        //                     for (var i in data) {
        //                         console.log("in for loop, data[i]=",data[i])
        //                         this.$store.commit('add_decks',data[i])
                                
        //                     }
        //                     this.unloaded=false
                            
        //                 })
        // }
        
    },

}
export default dashboard;