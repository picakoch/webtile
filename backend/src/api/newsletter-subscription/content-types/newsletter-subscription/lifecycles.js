module.exports = {
  async beforeCreate(event) {
    const {data} = event.params
    data.subscription_date = new Date();
  }
}
