import money from "v-money";

export default ({ Vue }) => {
  Vue.use(money, {
    decimal: ",",
    thousands: ".",
    precision: 2,
    masked: false
  })
}
