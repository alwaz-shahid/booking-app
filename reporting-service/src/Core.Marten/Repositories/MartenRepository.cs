using System;
using System.Threading;
using System.Threading.Tasks;
using Core.Domain;
using Core.Domain.Repositories;
using Marten;

namespace Core.Marten.Repositories
{
    public class MartenRepository<TAggregate> : IRepository<TAggregate> where TAggregate : class, IAggregateRoot
    {
        private readonly IDocumentSession documentSession;

        public MartenRepository(IDocumentSession documentSession)
        {
            this.documentSession = documentSession;
        }

        public async Task<TAggregate> FindAsync(Guid id, CancellationToken cancellationToken) =>
            await documentSession.Events.AggregateStreamAsync<TAggregate>(id, token:cancellationToken);

        public void Store(TAggregate aggregate, CancellationToken cancellationToken)
        {
            var events = aggregate.DequeueUncommittedEvents();
            documentSession.Events.Append(
                aggregate.Id,
                events
            );
        }
    }
}
