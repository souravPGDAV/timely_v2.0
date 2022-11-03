const temp={
    template:`
    <div>

        <h2 align="center">Password Reset</h2>
            <div class="alert alert-warning" role="alert" v-if="this.conditions.length>0">
                <ul>
                    <li v-for="item in this.conditions" :key="item">
                        {{item}}
                    </li>
                </ul>
            </div>
                <form method="POST" v-on:submit="validate" id="toBeValidated">
                <label for="password">Password</label>
                <input id="password" name="password" required="" type="password" value="" v-model="password">

                <label for="password_confirm">Retype Password</label>
                <input id="password_confirm" name="password_confirm" required="" type="password" value="" v-model="p_c">
                <input type="submit" id="submit" value="Submit"/>
                </form>
            <!--button id="submit"  class="btn btn-primary" v-on:click="validate()" v-if="this.conditions.length==0">Reset Password</button-->


    </div>`,
   data:function() {
        return{
        password:"",
        p_c:"",
        conditions:[],
        delimiters:['${','}'],
    }
    }   ,
    methods:{
        validate:function(e){
            
            if(this.conditions.length==0){
                return true
            }
            else{
                e.preventDefault()
                return false
            }
               
        },
    },
    watch:{
        password:function(val){
            this.conditions=[]
            var length_satisfied=true
            
            var digit=false
            var lower_case=false
            var upper_case=false
            var special_char_allowed=false
            var special_char=false
            //length:this.conditions.push("Password must be atleast 8 characters in length")
            if(val.length<8){length_satisfied=false}
            for(var i=0;i<val.length;i++){
                var char_code=val.charCodeAt(i)
                if(!(char_code!=33 && char_code!=64 && char_code!=35 && char_code!=36 && char_code!=37)){
                    special_char_allowed=true
                 
                }
                if(((char_code<=47 && char_code>=38) || (char_code>=58 && char_code<=63) ||(char_code>=91 && char_code<=96) ||(char_code>=123 && char_code>=126) ||char_code==32 || char_code==34)&& !special_char ){
                    special_char=true
                }
                if(char_code>=48 && char_code<=57){
                    digit=true
                }
                if(char_code>=65 && char_code<=90){
                    upper_case=true
                }
                if(char_code>=97 && char_code<=122){
                    lower_case=true
                }
        
            }
            if(!length_satisfied){this.conditions.push("Password must be atleast 8 characters in length")}
            if(!special_char_allowed || special_char){this.conditions.push("Password must contain atleast one special character only out of - !,@,#,$,%")}
            if(!lower_case){this.conditions.push("Password must contain atleast one lowercase letter")}
            if(!upper_case){this.conditions.push("Password must contain atleast one Uppercase letter")}
            if(!digit){this.conditions.push("Password must contain atleast one digit")}
            if(this.p_c!=val){this.conditions.push("Both passwords dont match")}
            // if(this.conditions.length==0){
            //     this.selection=4
            //     this.all_good[3]=true
            //     }
            // else{this.all_good[3]=false}
            
        
        },
        p_c:function(val){
            if(val==this.password){
                this.conditions.splice(this.conditions.indexOf("Both passwords dont match"),1)
            }
        },
    },
}
const routes=[
   
    {path:"/",name:'temp',component:temp},
 
 
]

const router=new VueRouter({
    routes,
    base:'/',
})
const app=new Vue({
    el:'#app',
    router
    
    
})