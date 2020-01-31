const stripe = Stripe('{{stripePublicKey}}');
Vue.component('stripeCard', {
    template: document.querySelector('#stripeCard'),
    props:{
        cardHolder: String,
        country: String,
        currency: String
    },
    data: function () {
        return {
            stripeError:'',
            card:false
        }
    },
    mounted() {
        const elements = stripe.elements();

        // style modification allowed by stripe.js
        const stripeStyles = [
            'color', 'fontWeight', 'fontFamily', 'fontSize', 'fontSmoothing', 'fontStyle',
            'fontVariant', 'lineHeight', 'letterSpacing', 'textDecoration', 'textShadow', 'textTransform'
        ];
        const filteredProperties = ['width', 'display'];
        this.getStyle(stripeStyles, filteredProperties).then(res => {
            this.card = elements.create('card', {
                style: {
                    base: res.style
                }
            });
            this.card.mount('#vastn3-stripe-card-input');
            // listen
            this.card.addEventListener('change',ev=>{
                this.stripeError = ev.error ? ev.error.message : '';
            }).addEventListener('blur', this.getToken)
        });


    },
    methods: {
        attachableProps(){
            let propObj = {};
            // supported properties and stripe.js translation
            const stripeProperties = [
                ['cardHolder','name'],
                ['country','address_country'],
                ['currency','currency'],
            ];
            stripeProperties.forEach(translation =>{
                if(this.$props[translation[0]]){
                    propObj[translation[1]] = this.$props[translation[0]];
                }
            });
            return propObj;
        },
        getToken(ev){
            setTimeout(async ()=> {
                if(this.stripeError === ''){

                    const {token, error} = await stripe.createToken(this.card, this.attachableProps());
                    if(error){
                        this.stripeError = error.message;
                        this.$emit('card-token',false);
                    } else {
                        this.$emit('card-token',token.id);
                    }

                }
            },300);
        },
        getStyle(stripeStyles, toFilter) {
            return new Promise(resolve => {
                setTimeout(() => {
                    let placeholderInput = this.$el.querySelector('input');
                    let propertyName;
                    let style = {};
                    let computedStyle = window.getComputedStyle(placeholderInput);
                    Array.from(computedStyle).forEach(styleProperty => {
                        if(toFilter.includes(styleProperty)){
                            return;
                        }
                        propertyName = styleProperty.replace(/-([a-z])/g, function (g) {
                            return g[1].toUpperCase();
                        });
                        placeholderInput.parentElement.style[propertyName] = computedStyle.getPropertyValue(styleProperty);
                        if(stripeStyles.includes(propertyName)){
                            style[propertyName] = computedStyle.getPropertyValue(styleProperty);
                        }

                    });
                    resolve({style: style, el: placeholderInput});
                }, 100);

            })


        }
    }
});
