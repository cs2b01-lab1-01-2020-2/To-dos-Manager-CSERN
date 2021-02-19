"""empty message

Revision ID: bd1ccda3eb2a
Revises: 256ec82f139d
Create Date: 2020-12-08 01:44:48.799962

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bd1ccda3eb2a'
down_revision = '256ec82f139d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('tablero',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('is_admin', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['usr.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.add_column('todo', sa.Column('created_date', sa.DateTime(), nullable=True))
    op.add_column('todo', sa.Column('deadline', sa.DateTime(), nullable=True))
    op.alter_column('todo', 'category_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('todo', 'category_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.drop_column('todo', 'deadline')
    op.drop_column('todo', 'created_date')
    op.drop_table('tablero')
    # ### end Alembic commands ###
