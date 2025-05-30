import discord

def on_member_join_event(role_id: int):
    async def on_member_join(member: discord.Member):
        role = member.guild.get_role(role_id)
        if role:
            await member.add_roles(role)
            print(f"Assigned role '{role.name}' to {member.name}")
        else:
            print(f"[ERROR] Role with ID {role_id} not found in {member.guild.name}")
    return on_member_join
