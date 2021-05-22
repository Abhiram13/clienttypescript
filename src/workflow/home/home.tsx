import React, {Fragment} from 'react';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import request from '../../helpers/helper';
import {State, Data, Item, User} from '../../helpers/interface';
import {ItemProvider, Context} from '../../context/context';
import Aside from './aside/aside';
// import View from './viewModal';
// import Edit from './editModal';
import Header from './header/header';

class Home extends React.Component<RouteComponentProps, State> {
   state: State = {
      data: [],
      char: '',
      backup: [],
      // user: {},
      loggedIn: false,
   };

   async componentDidMount() {
      const items: Item[] = await (await fetch('item/findall')).json();

      this.setState({
         data: items,
         backup: items,
      });
   }

   private changeCharacter(character: string) {
      let array = this.state.backup;
      let anotherArray: Item[] = [];

      if (character === '') {
         this.setState({data: this.state.backup});
         return;
      }

      switch (character.substring(0, 1)) {
         case '#':
            if (character.length > 1) {
               let str: string = character.slice(1, character.length);

               array.filter((item: Item) => {
                  if ((item.category.substring(0, character.length - 1)).toUpperCase() === str.toUpperCase()) {
                     anotherArray.push(item);
                  }
               });
            } else return;
            break;
         default:
            array.filter(function(item: Item) {
               if ((item.itemName.substring(0, character.length)).toUpperCase() === character.toUpperCase()) {
                  anotherArray.push(item);
               }
            });
            break;
      }

      this.setState({data: anotherArray});
      return;
   }

   // deleteItem = (item: Item): void => {
   //    request.post('deleteItem.js', item, (xhttp: XMLHttpRequest) => {
   //       //
   //    });
   // };

   // like = (item: Item): void => {
   //    const obj = {
   //       item: item,
   //       // user: this.state.user,
   //    };

   //    request.post('likeItemByUser.js', obj, (xhttp: XMLHttpRequest) => {
   //       const response = JSON.parse(xhttp.responseText);

   //       //this below function calls server to get the list of all Items
   //       if (response) {
   //          // request.get<Data>('getItem').then((res: Data) =>
   //          //    this.setState({
   //          //       data: res.documents,
   //          //       backup: res.documents,
   //          //       // user: response.user,
   //          //    })
   //          // );
   //       }
   //    });
   // };

   // itemDetails = (item: Item): void => {
   //    const user = this.state.user as User;
   //    // if (user.isAdmin) {

   //    // }
   //    this.props.history.push(`/${user._id}_${item._id}/details`);
   //    return;
   // };

   findLikedItem = (item: Item, userId: string): boolean => {
      for (let i = 0; i < item.likes.length; i++) {
         if (userId === item.likes[i].username) {
            return true;
         }
      }
      return false;
   };

   render(): React.ReactNode {
      const {data} = this.state;
      const contextObject: Context = {
         total: data.length,
         data: data,
      };

      return (
         <Fragment>
            <Header />
            <div className="container p-0 mx-auto mt-5">
               <ItemProvider value={contextObject}>
                  <Aside getValueForSearch={this.changeCharacter.bind(this)} />
               </ItemProvider>

               <hr />

               <div className="d-flex flex-wrap position-relative justify-content-between">
                  {(data !== []) &&
                     data.map((item: Item, i: number) => {
                        return (
                           <Fragment key={item._id}>
                              <section className="p-0 shadow mb-5 bg-white" style={{width: '22%', borderRadius: '13px'}}>
                                 <section className="col-sm-9 p-0 box_shadow mx-auto mt-3" style={{borderRadius: '13px'}}>
                                    {
                                       (item.imageURL === "")
                                          ? <img
                                             src="https://images.vexels.com/media/users/3/130737/isolated/preview/eda05fc56dfe940a821c06439bb7d49b-growing-plant-icon-by-vexels.png"
                                             className="w-100 h-100"
                                             alt=""
                                          />
                                          : <img src={item.imageURL} className="w-100 h-100" alt={item.itemName} />
                                    }
                                 </section>

                                 <section className="col-sm p-0 bg-white h-25 mt-3 radius">
                                    <section>
                                       <h5 className="text-center itemTitle pointer m-0 itemTitle">{item.itemName}</h5>
                                       <small className="d-block text-center lightGrey">{item.category}</small>
                                    </section>
                                    <section className="d-flex justify-content-between px-3 my-2">
                                       <small className="pointer">
                                          {/* {
                                             this.findLikedItem(item, userId)
                                                ? <span style={{color: '#FF1968'}}>Liked: {item.likes.length}</span>
                                                : <span>Like: {item.likes.length}</span>
                                          }  */}
                                       </small>
                                       <small>Comment</small>
                                    </section>
                                 </section>
                              </section>

                              {/* MODAL */}
                              {/* <View item={item} />
                              <Edit item={item} /> */}
                           </Fragment>
                        );
                     })
                  }

               </div>

            </div>
            {/* {(this.state.user as User).isAdmin && <button onClick={() => this.props.history.push('/add')}>Add</button>} */}
         </Fragment>
      );
   }
}

export default withRouter(Home);