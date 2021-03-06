# stripe-card

Payment method capturing component for vast-n3

## installation

1. In your vast-n3 project folder, run 

    `neoan3 add component stripeCard https://github.com/vast-n3/component-stripe-card.git`
    
2. Create credentials "vastn3_stripe" with properties "publicKey" and "secretKey"
    `neoan3 credentials`

3. Then, visit [your-project-url]/stripe-card


Example-usage in a form:
```javascript
const demoContainerTemplate = `
<form @submit.prevent="order" class="border rounded m-4 p-2">
    <div class="input">
        <label>Cardholder Name</label>
        <input type="text" minlength="5" v-model="name" required>
    </div>
    <stripe-card :cardholder-name="name" @card-token="attach"></stripe-card></div>
    
    <div class="input">
        <label>Amount (min.1)</label>
        <input type="number" min="1" step=".2" v-model="amount" required>
    </div>
    <div>
        <button :disabled="disabled" class="bg-success text-white disabled:opacity-50 disabled:cursor-not-allowed" type="submit">BUY</button>
    </div>
</form>
`;
Vue.component('demo-container', {
    data: function(){
        return {
            name:'',
            amount:0,
            cardToken:false,
            disabled:true
        }
    },
    template: demoContainerTemplate,
    watch: {
        cardToken:function(){this.validate()},
        name:function(){this.validate()},
        amount:function(){this.validate()}
    },
    methods: {
        validate(){
            this.disabled = !(this.cardToken && this.name.length > 3 && this.amount >= 1);
        },
        attach(token){
            this.cardToken = token;
        },
        order(event) {
            alert('send to server');
        }
    }
});

```