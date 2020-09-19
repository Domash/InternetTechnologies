let Error404 = {
  render: async () => {
    let view = `
      <section>
        <h1> Page not found </h1>
      </section>
    `
    return view
  },
  after_render: async () => {

  }
}

export default Error404;