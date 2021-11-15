'use strict';
const { convertRestQueryParams, buildQuery } = require('strapi-utils');
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {

    find: async (ctx) => {
       let filter = ctx.request.query;
        const user = ctx.state.user;    
        if (!user) {
          return ctx.badRequest(null, [{ messages: [{ id: 'No authorization header was found' }] }]);
        }
        filter = Object.assign(filter,{"user":user.id})
        const data = await strapi.services.todo.find(filter);  
    
        if(!data){
          return ctx.notFound();
        }
        ctx.send(data);
      }
};
