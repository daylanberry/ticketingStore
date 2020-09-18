import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/buildClient'
import Header from '../components/header'

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return(
    <div>
      <Header currentUser={currentUser} />
      <div className='container'>
        <Component {...pageProps} currentUser={currentUser} />
      </div>
    </div>
  )
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx)
  const { data } =  await client.get('/api/users/currentUser')

  let pageProps ={};

  // Check to see if child has get Initial props function
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser)
  }

  console.log('page props', pageProps)

  return {
    pageProps,
    ...data
  }
}


export default AppComponent