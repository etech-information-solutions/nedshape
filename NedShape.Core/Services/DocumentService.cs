using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic;
using NedShape.Core.Models;
using NedShape.Data.Models;

namespace NedShape.Core.Services
{
    public class DocumentService : BaseService<Document>, IDisposable
    {
        public DocumentService()
        {

        }

        /// <summary>
        /// Gets an entity using the specified id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public override Document GetById( int id )
        {
            context.Configuration.LazyLoadingEnabled = true;
            context.Configuration.ProxyCreationEnabled = true;

            return base.GetById( id );
        }

        /// <summary>
        /// Gets a list of the entities available using the specified search filters
        /// </summary>
        /// <param name="pm"></param>
        /// <param name="csm"></param>
        /// <returns></returns>
        public override List<Document> List( PagingModel pm, CustomSearchModel csm )
        {
            return ( from d in context.Documents
                     where
                     (
                         ( csm.Status != Enums.Status.All ? d.Status == ( int ) csm.Status : true )
                     )
                     select d
                   ).OrderBy( CreateOrderBy( pm.SortBy, pm.Sort ) )
                    .Skip( pm.Skip )
                    .Take( pm.Take )
                    .ToList();
        }

        /// <summary>
        /// Gets a document using the specified objectId, objectType and isMain
        /// </summary>
        /// <param name="objectId"></param>
        /// <param name="objectType"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public Document Get( int objectId, string objectType, string name )
        {
            return context.Documents.FirstOrDefault( d => d.ObjectId == objectId && d.ObjectType == objectType && d.Name == name );
        }

        /// <summary>
        /// Gets a list of Images using the specified objectId and objectType
        /// </summary>
        /// <param name="objectId"></param>
        /// <param name="objectType"></param>
        /// <returns></returns>
        public List<Document> List( int objectId, string objectType )
        {
            return context.Documents.Where( b => b.ObjectId == objectId && b.ObjectType == objectType ).ToList();
        }

        /// <summary>
        /// Checks if a document with the same title, category and type already exists...?
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public bool Exist( string title, string category, string type )
        {
            return context.Documents.Any( d => d.Title.ToLower() == title.ToLower() &&
                                               d.Category.ToLower() == category.ToLower() &&
                                               d.Type.ToLower() == type.ToLower() );
        }
    }
}
