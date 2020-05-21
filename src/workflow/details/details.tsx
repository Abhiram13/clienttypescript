import React, { useEffect, useState, Fragment } from 'react';
import request from '../../helpers/helper';
import { Item, Likes } from '../../helpers/interface';
import Header from '../../workflow/home/header/header';

function renderLikes(likes: Likes[], userId: string) {
   let array = [];

   for (let i = 0; i < likes.length; i++) {
      if (likes[i].username === userId) {
         array.push('You');
      } else {
         array.push(`${likes[i].firstname} ${likes[i].lastname}`);
      }
   }

   return array.join(', ');
}

const Details: React.FunctionComponent = (): React.ReactElement => {

   let obj: Item = {
      _id: '',
      category: '',
      comments: [],
      description: '',
      imageURL: '',
      itemName: '',
      likes: [],
      rating: 0,
   }

   const [item, getItem] = useState<Item>(obj);
   const [userID, getUserId] = useState<string>('');

   // below method will only be called when Component gets Mounted
   useEffect(() => {
      const [userId, itemId] = window.location.pathname.split('/')[1].split('_');

      request.get(`${itemId}/details`).then((response: Item) => {
         getItem(response as Item);
         getUserId(userId);
      });
   }, []);

   return (
      <Fragment>
         <Header />
         <section className="container m-0 p-0 mx-auto mt-5">
            <div className="col-sm p-0 d-flex justify-content-between">
               {
                  item &&
                  <Fragment>
                     <section className="col-sm-4 p-0">
                        {
                           item.imageURL === ''
                              ? <div className="col-sm p-0 box_shadow bg-white" style={{ borderRadius: '13px' }}>
                                 <img
                                    src='https://images.vexels.com/media/users/3/130737/isolated/preview/eda05fc56dfe940a821c06439bb7d49b-growing-plant-icon-by-vexels.png'
                                    className="w-100 h-100"
                                    alt=""
                                 />
                              </div>
                              : <div className="col-sm-9 p-0 box_shadow">
                                 <img
                                    src={item.imageURL}
                                    className="w-100 h-100"
                                    alt=""
                                 />
                              </div>
                        }                        
                     </section>
                     <section className="col-sm-6 p-0 m-0">
                        <h1><strong>{item.itemName}</strong></h1>
                        <p className="m-0 p-0 mb-5">{item.description}</p>
                        <span>
                           Liked by <strong>{renderLikes(item.likes, userID)}</strong>
                        </span>
                     </section>
                  </Fragment>
               }
            </div>
         </section>
      </Fragment>
   )
}

export default Details;